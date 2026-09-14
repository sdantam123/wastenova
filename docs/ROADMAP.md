# Project Roadmap — Global Recycle

## Development Phases

---

## Phase 0: Foundation (Weeks 1–3)

**Goal**: Project scaffolding, dev environment, CI/CD, core infrastructure.

### Deliverables
- [ ] iOS project created (Xcode, SwiftUI, Swift Package Manager)
- [ ] Backend monorepo: NestJS + TypeScript scaffold
- [ ] AI service: FastAPI scaffold
- [ ] PostgreSQL schema applied (Prisma migrations)
- [ ] Redis configured locally and in staging
- [ ] Docker Compose for full local stack
- [ ] GitHub Actions CI (build, lint, test on PR)
- [ ] Terraform infrastructure (AWS): VPC, ECS, RDS, ElastiCache, S3, API Gateway
- [ ] Staging environment deployed

### Team
| Role | Count |
|---|---|
| iOS Engineer | 2 |
| Backend Engineer | 2 |
| AI/ML Engineer | 1 |
| DevOps Engineer | 1 |
| UX Designer | 1 |

---

## Phase 1: Core MVP — US Only (Weeks 4–10)

**Goal**: End-to-end scan → result flow working for US addresses.

### Sprint 1 (Weeks 4–5): Camera + AI
- [ ] Camera view (AVFoundation + SwiftUI overlay)
- [ ] Photo capture & upload to backend
- [ ] AI service: GPT-4o Vision integration
- [ ] Structured output parsing (Pydantic)
- [ ] Object classification → RecyclingCategory enum
- [ ] Scan results screen (S-06)
- [ ] Item detail screen (S-07)

### Sprint 2 (Weeks 6–7): Location + Rules
- [ ] Core Location permission flow
- [ ] GPS → jurisdiction resolver (Google Geocoding)
- [ ] Seed database: 10 major US cities with recycling rules
- [ ] Rules Engine API (`GET /rules/{jurisdictionId}`)
- [ ] Display jurisdiction on results screen
- [ ] Manual location override (zip code entry)

### Sprint 3 (Weeks 8–9): Pickup Calendar
- [ ] Seed pickup schedules for 10 US cities
- [ ] Calendar API endpoint
- [ ] Pickup Calendar screen (S-08)
- [ ] Monthly calendar view component
- [ ] "Next 3 pickups" summary component
- [ ] Holiday delay handling

### Sprint 4 (Week 10): Drop-off Centers
- [ ] Seed drop-off center database (Earth911 import)
- [ ] Geo-spatial query (PostGIS radius search)
- [ ] Drop-off Centers API endpoint
- [ ] Drop-off Map screen (S-09)
- [ ] Center Detail screen (S-10)
- [ ] "Get Directions" → Apple Maps deep link

**MVP Exit Criteria**:
- User can scan 10 representative items and receive accurate recycling instructions
- Pickup calendar accurate for 10 US cities
- Drop-off centers shown within 25 miles for battery, electronics, and glass items

---

## Phase 2: Medical + Hazardous + Notifications (Weeks 11–14)

**Goal**: Full hazardous/medical handling and push notification system.

### Sprint 5 (Weeks 11–12): Medical Recycling
- [ ] DEA Drug Take-Back locator data import
- [ ] PaintCare API integration
- [ ] Call2Recycle (battery) API integration
- [ ] Medical drop-off API endpoint
- [ ] Medical Drop-off Map screen (S-11)
- [ ] Medical Location Detail screen (S-12)
- [ ] DEA National Take-Back Day event display
- [ ] Sharps disposal workflow

### Sprint 6 (Weeks 13–14): Notifications + History
- [ ] APNs integration (backend + iOS)
- [ ] Notification preferences screen
- [ ] Scheduled reminder jobs (BullMQ, nightly before pickup)
- [ ] Apple Calendar export (EventKit)
- [ ] Scan history persistence (Core Data caching)
- [ ] Scan History screen (S-13)

---

## Phase 3: Impact Tracking + Auth + Polish (Weeks 15–18)

**Goal**: User accounts, impact metrics, app polish for TestFlight.

### Sprint 7 (Weeks 15–16): Auth + Impact
- [ ] Sign in with Apple
- [ ] Sign in with Google
- [ ] User profile sync to backend
- [ ] Impact metrics calculation (CO₂, landfill weight)
- [ ] Impact Dashboard screen (S-14)
- [ ] Badges system (5 initial badges)
- [ ] Weekly streak tracking

### Sprint 8 (Weeks 17–18): Polish + Accessibility
- [ ] Onboarding screens (S-01, S-02)
- [ ] Error states and empty states for all screens
- [ ] Skeleton loaders for async content
- [ ] VoiceOver audit and fixes
- [ ] Dynamic Type support verified
- [ ] Haptic feedback on key interactions
- [ ] App icon + launch screen
- [ ] TestFlight internal distribution

---

## Phase 4: US Expansion + Beta (Weeks 19–24)

**Goal**: Expand coverage to Top 100 US cities. Open public beta.

- [ ] ETL pipeline for municipal open data (RecycleCoach API)
- [ ] Bulk import: pickup schedules for 100 US cities
- [ ] Expand drop-off center data: all 50 states
- [ ] Expand medical drop-off: all 50 states + territories
- [ ] Performance testing (k6 load tests)
- [ ] Backend auto-scaling validation
- [ ] Privacy Policy + Terms of Service
- [ ] App Store Connect setup
- [ ] TestFlight public beta (500 users)
- [ ] Beta feedback collection and prioritization

---

## Phase 5: International Expansion (Weeks 25–36)

**Goal**: Launch in Canada, UK, Australia. Localization framework.

### Countries — Priority Order
| Priority | Country | Challenge |
|---|---|---|
| 1 | Canada | Similar rules structure to US; French localization needed |
| 2 | United Kingdom | Recycle Now API; council-level rules |
| 3 | Australia | Recycling Near You; state-by-state variation |
| 4 | Germany | Duales System; strict multi-bin system; German localization |
| 5 | France | La Poubelle rules; French already available |
| 6 | Japan | 分別 system is highly granular; Japanese localization |

### International Requirements
- [ ] Localization framework (Localizable.strings)
- [ ] Country-specific data sources per country (see Tech Stack doc)
- [ ] Metric distances (km) for non-US countries
- [ ] Currency-free (no pricing displayed)
- [ ] GDPR compliance (EU users: data residency in EU)
- [ ] Local recycling symbol sets

---

## Phase 6: App Store Launch (Week 37)

- [ ] App Store Review submission
- [ ] App Store listing: screenshots, preview video, description (7 languages)
- [ ] Press kit
- [ ] Launch PR / social media
- [ ] Monitoring and on-call runbook
- [ ] Feature flags for gradual rollout

---

## Phase 7: Post-Launch Features (Months 10–12)

| Feature | Priority | Effort |
|---|---|---|
| AR overlay (live camera labeling) | High | Large |
| Barcode scanning (product → recycling rule) | High | Medium |
| Community reports (report wrong center hours) | Medium | Medium |
| Gamification leaderboards | Medium | Small |
| Corporate/business accounts | Low | Large |
| smartbin integrations (IoT) | Low | Large |
| Carbon offset marketplace | Low | Large |

---

## Milestones Summary

| Milestone | Target Date | Description |
|---|---|---|
| M0: Foundation | Week 3 | Dev environment + CI/CD |
| M1: MVP US | Week 10 | Scan → result, calendar, centers (US) |
| M2: Medical + Notifs | Week 14 | Full hazmat/medical flow, push notifications |
| M3: TestFlight Internal | Week 18 | Polished build, all core features |
| M4: Public Beta | Week 24 | Top 100 US cities, 500 beta users |
| M5: Canada + UK + AU | Week 32 | International launch (3 countries) |
| M6: App Store Launch | Week 37 | Full v1.0 release |
| M7: DE + FR + JP | Month 12 | European and Japan expansion |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| LLM misidentifies item | High | Medium | Confidence threshold + user correction flow |
| Municipal data stale or inaccurate | High | High | User reporting, quarterly ETL refresh, manual QA |
| LLM provider outage | Medium | High | Primary/fallback LLM, on-device Core ML fallback |
| App Store rejection | Medium | High | Privacy review early; no images stored without consent |
| Low coverage in rural areas | High | Medium | Graceful fallback to county/state rules; show data gap notice |
| GDPR compliance failure | Low | Critical | EU data residency, DPA, privacy-by-design from day 1 |
| Geocoding inaccuracy at township level | Medium | High | Multiple geocoding sources, user correction UI |
