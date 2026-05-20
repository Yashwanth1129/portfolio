# Deploy portfolio to your server (Docker Compose)

## Stack

| Service | Role | Port (default) |
|---------|------|----------------|
| `portfolio-web` | React site + nginx `/api` proxy | **80** |
| `portfolio-api` | .NET chatbot, contact, RAG | internal 8080 |
| `qdrant` | Vector DB for RAG | 6333 (dashboard), 6334 gRPC internal |

The old root `Dockerfile` (Alpine fortune) was a template placeholder — **do not use it**. Use this compose file instead.

## 1. Server prerequisites

- Docker Engine + Docker Compose v2
- Ports **80** (and **443** if you add TLS) open on the firewall

## 2. Configure secrets

On the server, in the `portfolio` folder:

```bash
cp .env.example .env
nano .env
```

Required:

- `OpenAI__ApiKey` — GitHub PAT with `models` scope
- `Email__Smtp__Password` — Gmail app password
- `PUBLIC_URL` — e.g. `https://yashwanthanantha.us` (used for CORS)

Leave `REACT_APP_API_URL` **empty** so the site calls `/api` on the same host via nginx.

## 3. Build and run

```bash
docker compose up -d --build
```

Check:

```bash
docker compose ps
curl http://localhost/health
curl http://localhost/api/rag/status
```

## 4. Index RAG data (first time)

```bash
docker compose --profile tools run --rm rag-index
```

Or from outside:

```bash
curl -X POST "http://YOUR_SERVER/api/rag/index?recreate=true"
```

Confirm `pointCount` > 0 in `/api/rag/status`.

## 5. HTTPS (recommended)

Put **Caddy** or **nginx** on the host in front of port 80, or use a cloud load balancer with TLS. Update `PUBLIC_URL` and redeploy API if CORS errors appear.

## 6. Resume Tailor app (port 5140)

That app is a **separate** project (not in this compose). After you containerize and deploy it on the server, update `liveUrl` in `src/data/portfolioData.js`:

```javascript
liveUrl: "https://resume.yourdomain.com/",
```

Rebuild only the web image:

```bash
docker compose up -d --build portfolio-web
```

## Local debug compose

```bash
docker compose -f compose.yaml -f compose.debug.yaml up --build
```

- Site: http://localhost:3000  
- API: http://localhost:5241  
- Qdrant UI: http://localhost:6333/dashboard  

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Chatbot can’t reach API | `REACT_APP_API_URL` should be empty in production; rebuild `portfolio-web` |
| CORS error | Set `PUBLIC_URL` to exact browser URL (scheme + host) |
| RAG empty / no points | Run `rag-index` profile; check `OpenAI__ApiKey` |
| Contact email fails | Check Gmail app password in `.env` |
| Qdrant connection | API uses host `qdrant` inside compose — do not set `localhost` in `.env` for Qdrant |
