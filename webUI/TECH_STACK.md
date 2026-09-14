# Technology Stack — Recycle Compass Web UI

## Core Framework

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| Language | TypeScript | 5.x | Type safety, IDE intelligence, fewer runtime errors |
| UI Framework | React | 18.x | Component model, concurrent rendering, wide ecosystem |
| Build Tool | Vite | 5.x | Instant HMR, ESM-native, fast production builds |
| Package Manager | npm / pnpm | latest | Workspace support, lock-file consistency |

---

## UI & Design System

| Library | Version | Purpose |
|---|---|---|
| Material UI (MUI) | v6 | Component library — buttons, dialogs, tables, icons |
| MUI X Date Pickers | v7 | Pickup calendar date pickers |
| MUI X Data Grid | v7 | Fallback light tables (non-AG Grid views) |
| `@mui/icons-material` | v6 | Icon set (recycling, location, calendar icons) |
| Emotion | v11 | CSS-in-JS engine used by MUI |

### MUI Theme Customization
Custom theme defined in `src/theme/theme.ts` extending MUI's default palette with Recycle Compass design tokens:

```ts
const theme = createTheme({
  palette: {
    primary:   { main: '#2E7D32' },   // curbside green
    warning:   { main: '#F57F17' },   // drop-off amber
    error:     { main: '#C62828' },   // hazardous red
    info:      { main: '#1565C0' },   // calendar blue
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
});
```

---

## Data Grids

| Library | Purpose |
|---|---|
| AG Grid Community | Free tier — resident-facing tables (search results, drop-off lists) |
| AG Grid Enterprise | Admin portal — row grouping, pivoting, Excel export, master-detail |

### AG Grid Modules Used
- `ClientSideRowModelModule` — in-memory data with filtering/sorting
- `ServerSideRowModelModule` — paginated server-side data for large rule sets
- `MasterDetailModule` — expandable rows for recycling rule detail
- `ExcelExportModule` — export rules and schedules for municipalities
- `ColumnsToolPanelModule` — column visibility manager in admin views
- `FiltersToolPanelModule` — saved filter presets for admins

---

## Routing & Navigation

| Library | Version | Purpose |
|---|---|---|
| React Router | v6 | Client-side routing, nested routes, lazy loading |
| `react-router-dom` | v6 | Browser history, `<Outlet>`, `useNavigate` |

---

## State Management

| Library | Purpose |
|---|---|
| Redux Toolkit (RTK) | Global app state — auth session, location context, user preferences |
| RTK Query | Server state caching — API calls with auto-caching and invalidation |
| Zustand | Local feature state — lightweight stores for UI state |
| React Context | Theme, locale, and auth context propagation |

---

## API & Networking

| Library | Purpose |
|---|---|
| RTK Query | Primary data fetching with caching, polling, and cache invalidation |
| Axios | Raw HTTP client for non-RTK requests and file uploads |
| `@tanstack/react-query` (optional) | Complex dependent queries where RTK Query is insufficient |

---

## Maps

| Library | Purpose |
|---|---|
| `@react-google-maps/api` | Drop-off center maps, user location pin |
| Google Maps JavaScript API | Tile rendering, geocoding, directions |

---

## Forms & Validation

| Library | Purpose |
|---|---|
| React Hook Form | Performant form handling with minimal re-renders |
| Zod | Runtime schema validation; shared with backend type contracts |
| `@hookform/resolvers` | Connects Zod schemas to React Hook Form |

---

## Data Visualization

| Library | Purpose |
|---|---|
| Recharts | Impact dashboards — CO₂ saved, items recycled (bar/line/pie) |
| MUI X Charts | Lightweight sparklines in admin dashboards |

---

## Authentication

| Library | Purpose |
|---|---|
| Firebase Auth | Google OAuth + email/password login for residents |
| JWT (custom) | Session tokens for API calls |
| `@mui/material` | Login / registration dialog components |

---

## Internationalization

| Library | Purpose |
|---|---|
| `react-i18next` | Translation strings per locale |
| `i18next` | Core i18n engine |
| `date-fns` | Locale-aware date formatting |

---

## Testing

| Library | Purpose |
|---|---|
| Vitest | Unit and integration tests (Vite-native) |
| React Testing Library | DOM-based component testing |
| MSW (Mock Service Worker) | API mocking in tests |
| Playwright | End-to-end browser tests |

---

## Code Quality

| Tool | Purpose |
|---|---|
| ESLint | Linting with `eslint-plugin-react`, `@typescript-eslint` |
| Prettier | Code formatting |
| Husky + lint-staged | Pre-commit linting and formatting checks |
| TypeScript strict mode | Enabled — `strict: true` in `tsconfig.json` |

---

## Development Tooling

| Tool | Purpose |
|---|---|
| Vite | Dev server, HMR, bundling |
| Storybook | Component development and visual documentation |
| `vite-plugin-svgr` | Import SVGs as React components |
| `@vitejs/plugin-react` | React Fast Refresh |

---

## CI/CD & Deployment

| Tool | Purpose |
|---|---|
| GitHub Actions | CI pipeline — lint, test, build |
| AWS CloudFront + S3 | Static hosting and CDN delivery |
| AWS Amplify (optional) | Managed deployment with preview branches |
| Sentry | Error tracking in production |

---

## Browser Support

| Browser | Minimum Version |
|---|---|
| Chrome | 110+ |
| Firefox | 110+ |
| Safari | 15.4+ |
| Edge | 110+ |
| Mobile Safari | iOS 15+ |
| Mobile Chrome | Android 10+ |
