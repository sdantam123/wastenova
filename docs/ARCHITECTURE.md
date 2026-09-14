# System Architecture — Global Recycle

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        iOS Application (Swift/SwiftUI)              │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐  ┌─────────────┐  │
│  │  Camera  │  │  Location    │  │  UI/Views  │  │ Notifications│  │
│  │  Module  │  │  Service     │  │  (SwiftUI) │  │  Manager    │  │
│  └────┬─────┘  └──────┬───────┘  └─────┬──────┘  └─────────────┘  │
│       │               │                │                            │
│       └───────────────┴────────────────┘                           │
│                        App Coordinator                              │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTPS / REST + WebSocket
┌────────────────────────────▼────────────────────────────────────────┐
│                      API Gateway (AWS API Gateway / Kong)           │
└──────┬──────────────────────────────────┬───────────────────────────┘
       │                                  │
┌──────▼──────────────┐        ┌──────────▼────────────────────────┐
│   AI / Vision       │        │   Core Backend (Node.js / NestJS) │
│   Service           │        │                                   │
│  ┌───────────────┐  │        │  ┌──────────────────────────────┐ │
│  │ Image Analysis│  │        │  │ Auth Service (JWT / OAuth2)  │ │
│  │ (GPT-4o /     │  │        │  └──────────────────────────────┘ │
│  │  Gemini Pro   │  │        │  ┌──────────────────────────────┐ │
│  │  Vision)      │  │        │  │ Location Resolver Service    │ │
│  └───────────────┘  │        │  │ (Geocoding → Township/County)│ │
│  ┌───────────────┐  │        │  └──────────────────────────────┘ │
│  │ Object Tagger │  │        │  ┌──────────────────────────────┐ │
│  │ & Classifier  │  │        │  │ Recycle Rules Engine         │ │
│  └───────────────┘  │        │  │ (Rules DB + LLM enrichment)  │ │
│  ┌───────────────┐  │        │  └──────────────────────────────┘ │
│  │ Recycle       │  │        │  ┌──────────────────────────────┐ │
│  │ Advice LLM    │  │        │  │ Calendar & Schedule Service  │ │
│  └───────────────┘  │        │  └──────────────────────────────┘ │
└─────────────────────┘        │  ┌──────────────────────────────┐ │
                               │  │ Drop-off Centers Service     │ │
                               │  └──────────────────────────────┘ │
                               │  ┌──────────────────────────────┐ │
                               │  │ Medical Recycle Service      │ │
                               │  └──────────────────────────────┘ │
                               └──────────────┬────────────────────┘
                                              │
              ┌───────────────────────────────┼──────────────────────┐
              │                               │                      │
   ┌──────────▼──────────┐   ┌───────────────▼────┐   ┌────────────▼───────┐
   │  PostgreSQL          │   │  Redis Cache        │   │  S3 / Cloud        │
   │  (Primary DB)        │   │  (Rules, Calendars) │   │  Storage           │
   │  - Users             │   │  TTL: 24h           │   │  (Images)          │
   │  - Locations         │   └────────────────────┘   └────────────────────┘
   │  - Recycle Rules     │
   │  - Drop-off Centers  │
   │  - Pickup Schedules  │
   └─────────────────────┘

External Services
─────────────────
  • Google Maps Geocoding API — lat/lng → address hierarchy
  • OpenAI GPT-4o Vision / Google Gemini Pro Vision — image analysis
  • Earth911 API / iRecycle API — drop-off center data (US)
  • EPA RxSS / DEA Drug Take Back — medical disposal locations
  • Municipal Open Data APIs — county/township pickup schedules
  • Apple Push Notification Service (APNs) — reminders
```

---

## Component Breakdown

### 1. iOS Client
- **Language**: Swift 5.9+
- **UI**: SwiftUI + UIKit (Camera)
- **Frameworks**: Core Location, AVFoundation, UserNotifications, MapKit
- **State Management**: Combine + Swift Concurrency (async/await)
- **Offline**: Core Data cache for rules and schedules

### 2. AI Vision Service (Python / FastAPI)
- Accepts an image from the client
- Calls a multimodal LLM (GPT-4o Vision or Gemini) to identify objects
- Returns structured JSON: object list, recyclability, category
- Falls back to on-device Core ML model for offline scenarios

### 3. Core Backend (Node.js / NestJS)
- Stateless REST APIs
- Location Resolver: converts GPS coords → township, county, state, country via geocoding
- Rules Engine: queries jurisdiction-specific recycling rules
- Calendar Service: returns pickup schedule for an address
- Centers Service: returns nearby drop-off centers with filters (distance, material, medical)

### 4. Rules Database
- Hierarchical: Country → State → County → Township
- Each node defines: accepted materials, collection frequency, special instructions
- Updated via scheduled ETL jobs from municipal data sources

### 5. Caching Strategy
- Redis caches recycling rules by jurisdiction (TTL: 24 hours)
- Pickup calendars cached by zip/postal code
- Drop-off center lists cached regionally

---

## Security

| Concern | Approach |
|---|---|
| Authentication | JWT tokens via OAuth2 (Sign in with Apple / Google) |
| Image privacy | Images discarded server-side after analysis; not stored |
| API rate limiting | Per-user throttling at API Gateway |
| Data in transit | TLS 1.3 enforced |
| Location data | User consent required; not persisted beyond session |
