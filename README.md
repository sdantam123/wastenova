# ♻️ Global Recycle — iPhone Application

## Overview

**Global Recycle** is an intelligent iPhone application that empowers users worldwide to recycle correctly. Using the device camera, AI-powered object recognition, and location-aware recycling rules, it guides users through the exact recycling steps for any item — whether it's picked up at home, dropped at a local center, or requires special medical/hazardous disposal.

---

## Core User Journey

```
[User] → Takes Photo → [AI identifies objects]
                              ↓
                   [Location detected: Township / County / State / Country]
                              ↓
                   [Recycling rules fetched for that jurisdiction]
                              ↓
          ┌────────────────────────────────────────────────┐
          │                                                │
   Curbside Pickup           Drop-off Center         Medical / Hazardous
   (Show Pickup Calendar)    (Show Location Info)    (Show Drop-off Sites + Hours)
```

---

## Key Features

| Feature | Description |
|---|---|
| 📷 Camera Identification | Snap a photo; LLM identifies all recyclable objects |
| 📍 Location-Aware Rules | Detects township, county, state, and country for jurisdiction-specific rules |
| 🗓️ Pickup Calendar | Shows scheduled curbside collection dates for accepted materials |
| 🏢 Drop-off Centers | Lists local recycling centers with addresses, hours, and accepted materials |
| 💊 Medical Recycling | Locates pharmacy/hospital drop-off programs for medications and sharps |
| 🌍 Global Coverage | Supports recycling programs across multiple countries |
| 🔔 Reminders | Push notifications for upcoming collection days |
| 📊 Impact Tracking | Shows the user's recycling footprint and environmental impact |

---

## Documentation Index

| Document | Description |
|---|---|
| [Architecture](./docs/ARCHITECTURE.md) | System architecture and component overview |
| [Features](./docs/FEATURES.md) | Detailed feature specifications |
| [Tech Stack](./docs/TECH_STACK.md) | Technologies, frameworks, and services used |
| [API Design](./docs/API_DESIGN.md) | API endpoints and data contracts |
| [UI/UX Flows](./docs/UI_UX_FLOWS.md) | Screen flows and user experience design |
| [Data Models](./docs/DATA_MODELS.md) | Database schemas and data structures |
| [Roadmap](./docs/ROADMAP.md) | Development phases and milestones |

---

## Quick Start (Development)

```bash
# Prerequisites
# - Xcode 16+
# - Node.js 20+ (for backend services)
# - Python 3.12+ (for AI/ML services)

# Clone and install
git clone https://github.com/your-org/global-recycle.git
cd global-recycle

# iOS App
cd ios && pod install
open GlobalRecycle.xcworkspace

# Backend
cd ../backend && npm install && npm run dev

# AI Service
cd ../ai-service && pip install -r requirements.txt && uvicorn main:app --reload
```

---

## License
MIT
