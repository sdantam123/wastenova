# Technology Stack — Global Recycle

## iOS Application

| Layer | Technology | Rationale |
|---|---|---|
| Language | Swift 5.9+ | Native performance, safety |
| UI Framework | SwiftUI 5 | Declarative, modern, animations |
| Camera | AVFoundation | Full camera control, live preview |
| Maps | MapKit + SwiftUI Map | Native, offline-capable, Apple Maps |
| Location | Core Location | GPS, geocoding, significant location changes |
| Notifications | UserNotifications | Local + remote push (APNs) |
| Calendar Export | EventKit | Native Apple Calendar integration |
| Networking | URLSession + async/await | Modern Swift concurrency |
| Local Storage | Core Data | Offline rules and history cache |
| Auth | Sign in with Apple + Google OAuth | Privacy-first, frictionless |
| Analytics | Firebase Analytics | User behavior, crash reporting |
| On-device ML | Core ML (fallback) | Offline object detection |
| Dependency Mgmt | Swift Package Manager | Native, no CocoaPods needed |

---

## AI / Vision Service

| Component | Technology | Rationale |
|---|---|---|
| Runtime | Python 3.12 | Mature ML ecosystem |
| Web Framework | FastAPI | Async, OpenAPI auto-docs, fast |
| Primary LLM | OpenAI GPT-4o Vision | Best-in-class multimodal accuracy |
| Fallback LLM | Google Gemini 1.5 Pro Vision | Redundancy, cost optimization |
| Image Processing | Pillow + OpenCV | Pre-processing before LLM call |
| Prompt Engineering | LangChain | Structured output, prompt templates |
| Response Validation | Pydantic v2 | Type-safe structured JSON from LLM |
| Containerization | Docker | Environment consistency |
| Container Orchestration | AWS ECS Fargate | Auto-scaling, serverless containers |

### LLM Prompt Strategy
```
System: You are a recycling expert. Analyze the image and identify all objects.
        For each object return: name, material type, recyclability (true/false),
        recycling category (CURBSIDE/DROPOFF/MEDICAL/HAZARDOUS/COMPOST/NOT_RECYCLABLE),
        preparation instructions. Return ONLY valid JSON.

User:   [Image attachment]
        My location is: {township}, {county}, {state}, {country}
        Return recycling advice applicable to this jurisdiction.
```

---

## Backend Services

| Component | Technology | Rationale |
|---|---|---|
| Runtime | Node.js 20 LTS | Async I/O, large ecosystem |
| Framework | NestJS | TypeScript, modular, enterprise-grade |
| Language | TypeScript 5 | Type safety across backend |
| API Style | REST + OpenAPI 3.0 | Broad client compatibility |
| Primary DB | PostgreSQL 16 | Relational, JSONB for flexible rules |
| Cache | Redis 7 | Sub-millisecond rules lookups |
| ORM | Prisma | Type-safe DB client |
| Job Queue | BullMQ (Redis) | ETL jobs for rules updates |
| Auth | Passport.js + JWT | Flexible auth strategies |
| Validation | Zod | Runtime schema validation |
| Logging | Winston + AWS CloudWatch | Structured logs |
| Containerization | Docker + Docker Compose | Local dev parity |
| Orchestration | AWS ECS Fargate | Production scale |

---

## Infrastructure & DevOps

| Component | Technology |
|---|---|
| Cloud Provider | AWS (primary) |
| API Gateway | AWS API Gateway + WAF |
| CDN | AWS CloudFront |
| File Storage | AWS S3 (images, ephemeral) |
| DNS | AWS Route 53 |
| Secrets | AWS Secrets Manager |
| CI/CD | GitHub Actions |
| IaC | Terraform |
| Monitoring | AWS CloudWatch + DataDog |
| Error Tracking | Sentry (iOS + backend) |
| Load Testing | k6 |

---

## External APIs & Data Sources

| Service | Purpose | Coverage |
|---|---|---|
| Google Maps Geocoding API | GPS → address hierarchy | Global |
| Earth911 / iRecycle API | Drop-off center database | USA/Canada |
| Recycling Near You (AU) | Drop-off centers | Australia |
| Recycle Now API | Drop-off centers | United Kingdom |
| DEA Drug Take-Back Locator | Medical drop-off | USA |
| PaintCare Locator API | Paint recycling | USA |
| Call2Recycle API | Battery drop-off | USA/Canada |
| EPA eManifest / Open Data | Hazardous waste sites | USA |
| Municipal Open Data Portals | Pickup calendars | Per city/county |
| RecycleCoach API | Schedules + rules | North America |

---

## Data Pipeline (ETL)

```
Municipal Websites / Open Data APIs
            ↓
   ETL Workers (BullMQ Jobs)
   - Scheduled: nightly at 2 AM local
   - Triggered: on data source update webhook
            ↓
   Normalizer (maps to internal schema)
            ↓
   PostgreSQL (Rules DB)
            ↓
   Redis Cache invalidated
```

---

## Development Environment

```bash
# Required tools
node >= 20
python >= 3.12
docker >= 24
xcode >= 16
terraform >= 1.8

# Services (local via Docker Compose)
postgres:16
redis:7
localstack (AWS emulation for local dev)
```
