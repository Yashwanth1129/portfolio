# Portfolio API (.NET)

RAG chatbot backend + **real email** for contact forms.

## Email (recommended: Gmail SMTP)

EmailJS does **not** work reliably from a server (browser-only). This API sends real email via **SMTP (MailKit)** or optionally [Resend](https://resend.com).

### Option A — Gmail SMTP (easiest if you use Gmail)

1. Turn on [2-Step Verification](https://myaccount.google.com/security) for your Google account.
2. Create an [App Password](https://myaccount.google.com/apppasswords) (Mail → Other → "Portfolio API").
3. Configure secrets (never commit the password):

```bash
cd Portfolio.Api
dotnet user-secrets set "Email:Smtp:Password" "YOUR_16_CHAR_APP_PASSWORD"
dotnet user-secrets set "Email:Smtp:Username" "yashwanthanantha99@gmail.com"
```

`appsettings.json` already sets `Email:Provider` to `Smtp` and `ToAddress` to your inbox. Messages use **Reply-To** = recruiter's email so you can reply directly.

### Option B — Resend (production / custom domain)

1. Sign up at [resend.com](https://resend.com), verify your domain.
2. Set provider and API key:

```bash
dotnet user-secrets set "Email:Provider" "Resend"
dotnet user-secrets set "Email:Resend:ApiKey" "re_xxxx"
dotnet user-secrets set "Email:Resend:FromAddress" "Portfolio <hello@yourdomain.com>"
```

## RAG: two connections

| Service | Config | Purpose |
|---------|--------|---------|
| **GitHub Models** | `OpenAI:ApiKey`, `OpenAI:Endpoint` | Embeds text → vectors (needs PAT) |
| **Qdrant** | `Qdrant:Host`, `Qdrant:Port` **6334** | Stores vectors (local Docker, no key) |

API key in **user secrets OR appsettings** both work; secrets override appsettings in Development.

```bash
dotnet user-secrets set "OpenAI:ApiKey" "YOUR_GITHUB_PAT"
```

Check connections before indexing:

```bash
curl http://localhost:5241/api/rag/status
# qdrantReachable: true, embeddingsReachable: true
```

## Run

```bash
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant

dotnet run --project Portfolio.Api
curl -X POST "http://localhost:5241/api/rag/index?recreate=true"
```

Frontend: set `REACT_APP_API_URL=http://localhost:5241` in `.env`, then `npm start`.

## API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/chat` | RAG chat |
| POST | `/api/contact` | Send email to your inbox |
| POST | `/api/rag/index?recreate=true` | Index portfolio JSON into Qdrant |
