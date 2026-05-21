const portfolioData = {
    profile: {
      name: "Yashwanth Anantha",
      title: "SOFTWARE ENGINEER",
      email: "yashwanthanantha99@gmail.com",
      phone: "(463) 279-1911",
      github: "GitHub",
      linkedin: "LinkedIn",
      bio : "I'm Yashwanth Anantha, a software engineer and Master's student at Indiana University Indianapolis. I specialize in building scalable C# applications using .NET, microservices, and full-stack technologies to solve complex business problems efficiently."
    },
    education: [
        {
          id: 1,
          university: "Indiana University, Indianapolis",
          degree: "Master of Science",
          major: "Computer and Information Science",
          graduationDate: "May 2026",
          startDate: "August 2024",
          endDate: "May 2026",
          gpa: "3.74/4.0"
        },
        {
          id: 2,
          university: "KL University, India",
          degree: "Bachelor of Technology",
          major: "Computer Science and Engineering",
          graduationDate: "March 2022",
          startDate: "June 2018",
          endDate: "March 2022",
          gpa: "3.8/4.0"
        }
      ],
    certifications: [
      {
        id: "az-900",
        code: "AZ-900",
        name: "Azure Fundamentals",
        issuer: "Microsoft",
        credentialUrl: "/az900.pdf"
      },
      {
        id: "az-204",
        code: "AZ-204",
        name: "Azure Developer Associate",
        issuer: "Microsoft",
        credentialUrl: "/az204.pdf"
      }
    ],
    experience: [
      {
        id: 1,
        company: "SuperQuickQuestion",
        title: "Software Engineer",
        location: "Indianapolis",
        startDate: "May 2025",
        endDate: "Present",
        description: [
          "Led design and implementation of a .NET Core microservice using C#, CQRS pattern, and Domain-Driven Design to meet business requirements for scalable and resilient distributed systems",
          "Developed and maintained reusable field management libraries with SQL persistence and Azure Blob Storage, incorporating retry mechanisms to ensure high availability and fast data retrieval.",
          "Built Azure Functions as isolated public endpoints for form submissions, enabling auto-scaling and system stability under high traffic without impacting system availability.",
          "Created background worker services subscribing to Azure Service Bus for asynchronous processing including submission validation and duplicate detection, demonstrating expertise in event-driven architecture.",
          "Provisioned and managed Azure infrastructure using Terraform, automating deployment pipelines with CI/CD tools to ensure consistent environment setups and rapid delivery",

        ]
      },
      {
        id: 2,
        company: "Cognizant",
        title: "Software Developer",
        location: "Hyderabad",
        startDate: "Jan 2022",
        endDate: "August 2024",
        description: [
          "Developed and maintained full-stack applications using C# (.NET), Angular, and SQL Server for Thomson Reuters financial systems, improving performance by 20% through query optimization and frontend enhancements.",
          "Wrote and optimized complex T-SQL queries, stored procedures, and database schemas for MS SQL Server and Oracle DB, significantly reducing API response times",
          "Collaborated with frontend teams to build responsive web applications using Angular and JavaScript, ensuring cross-browser compatibility and consistent user experience",
          "Integrated backend services with Azure DevOps pipelines and event-driven workflows to streamline continuous integration and delivery for financial applications",
          "Strong experience in containerization of microservices architecture applications using Docker and Kubernetes, where I have containerized services of 3 development teams and managed deployments in AKS clusters"
        ]
      }
      
    ],
    projects: [
      {
        id: "resume-tailor-rag",
        name: "AI Resume Tailor (RAG)",
        subtitle: "Semantic Kernel · Vector Search · Full-Stack",
        technologies: [
          "C#",
          ".NET 9",
          "ASP.NET Core",
          "Semantic Kernel",
          "GitHub Models API",
          "Qdrant",
          "Razor Pages",
          "Docker",
          ".NET Aspire",
          "QuestPDF",
          "PdfPig"
        ],
        summary: "A full-stack application that uploads a resume PDF, indexes it in a vector database, and tailors content to a job description using RAG and LLM-powered rewriting.",
        description: [
          "Developed a Resume Tailor web application using ASP.NET Core, Semantic Kernel, and Qdrant, enabling users to upload a PDF resume and generate job-specific tailored versions.",
          "Implemented PDF text extraction and intelligent chunking to split resume content into searchable sections while preserving document structure.",
          "Built an ingestion pipeline that generates embeddings via GitHub Models (OpenAI-compatible API) and stores vectors in Qdrant for semantic search.",
          "Designed a RAG workflow where job descriptions trigger vector similarity search to retrieve the most relevant resume sections before LLM tailoring.",
          "Created a Semantic Kernel plugin (`resume_search`) with automatic function calling so the chat assistant grounds responses in indexed resume data only.",
          "Built a dedicated tailoring service that preserves the user's original resume sections and rewrites bullets with ATS-friendly keywords without inventing experience.",
          "Developed a responsive web UI with resume upload, job description input, chat-based Q&A, and structured tailor output with Markdown and PDF download.",
          "Configured Qdrant locally with Docker (gRPC/HTTP) and integrated the Microsoft Semantic Kernel Qdrant vector store connector for collection management and upsert/search operations.",
          "Used .NET Aspire AppHost and shared service defaults for observability, health checks, HTTP resilience, and multi-service orchestration.",
          "Applied dependency injection for modular services (PDF loader, chunker, ingestion, vector search, tailoring, PDF export) following clean separation of concerns."
        ],
        challenges: [
          "Aligning OpenAI-compatible GitHub Models API calls with Semantic Kernel chat and embedding endpoints",
          "Ensuring Qdrant collections receive vectors correctly (embedding failures vs. empty collections)",
          "Preserving original resume structure in tailored output instead of forcing a generic template",
          "Handling long-running LLM/embedding requests under Aspire HTTP resilience and timeout policies",
          "Avoiding nested HTML forms and fixing file export flows (PDF/Markdown download)"
        ],
        outcomes: [
          "Delivered an end-to-end RAG pipeline: PDF → chunks → embeddings → Qdrant → job-driven retrieval → tailored resume",
          "Demonstrated practical use of vector databases and semantic search for real-world document tailoring",
          "Gained hands-on experience with Semantic Kernel plugins, embeddings, and LLM orchestration in .NET"
        ],
        year: "2025",
        liveUrl: "http://localhost:5140/",
        liveUrlNote: "Runs locally while developing — update this URL when deployed to your server."
      },
      {
        id: "heart-matching",
        name: "Heart Matching – AI Powered Platform",
        subtitle: "AI Matchmaking System",
        technologies: ["Java", "Spring Boot", "Hibernate", "Spring Security", "JWT", "WebSockets", "Hugging Face AI"],
        summary: "A matchmaking platform that uses AI to compute user compatibility based on semantic similarities.",
        description: [
          "Designed and implemented a full-stack matchmaking backend using Spring Boot, Spring Security, JWT, and WebSockets to support real-time communication.",
          "Integrated Spring AI with Hugging Face's MiniLM-L6-v2 model to compute user compatibility using semantic embeddings and cosine similarity, improving match relevance.",
          "Built secure authentication and authorization using JWT-based login, custom JwtFilter, and user roles.",
          "Implemented private chat functionality with WebSocket endpoints, enabling real-time messaging with support for read receipts, message status, and user blocking.",
          "Developed modular REST APIs (/api/auth, /api/match, /api/chat) with full Swagger/OpenAPI documentation for developer collaboration.",
          "Configured H2 and MySQL databases, along with Spring Data JPA, to manage user profiles, chat logs, and AI-processed embeddings.",
          "Enabled AI fallback mechanisms and exception handling to ensure availability and robustness even during Hugging Face API downtimes."
        ],
        challenges: [
          "Processing and analyzing semantic embeddings efficiently",
          "Implementing real-time chat with WebSockets",
          "Designing an effective AI-based matching algorithm"
        ],
        outcomes: [
          "Created a robust AI-powered matchmaking platform",
          "Successfully implemented real-time chat features",
          "Gained expertise in using AI models within Java applications"
        ],
        year: "2023"
      }
    ],
    skills: [
      {
        category: "Frontend & UI/UX",
        technologies: "HTML5, CSS3, JavaScript, TypeScript, Angular, React, jQuery, Blazor, WPF"
      },
      {
        category: "Backend & APIs",
        technologies: "C#, ASP.Net Core, ASP.NET MVC, ASP.NET Web API, Blazor, Entity Framework, JWT, LINQ, JWT Token Authentication & Authorization, Dependency Injection, async/await, Semantic Kernel, REST APIs"
      },
      {
        category: "Databases",
        technologies: "SQL Server, PostgreSQL, MySQL, Oracle DB, SQLite, Mongo DB, NoSQL"
      },
      {
        category: "Cloud & DevOps",
        technologies: "Azure (Functions, Service Bus, Event Grid, DevOps, CI/CD), Docker, Terraform, Jenkins, ArgoCD, Kubernetes"
      }
    ]
  };
  
  export default portfolioData;
