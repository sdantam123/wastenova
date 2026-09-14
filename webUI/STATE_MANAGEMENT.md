# State Management — Recycle Compass Web UI

## Strategy Overview

Recycle Compass Web uses a layered state management approach, choosing the right tool for each type of state:

| State Type | Tool | Examples |
|---|---|---|
| **Server state** (API data) | RTK Query | Recycling rules, drop-off centers, pickup schedules |
| **Global UI state** | Redux Toolkit | Auth session, active jurisdiction/location |
| **Local feature state** | Zustand | Filter selections, map viewport, grid state |
| **Form state** | React Hook Form | Admin forms, address inputs, search inputs |
| **Ephemeral UI state** | `useState` / `useReducer` | Modal open/close, drawer visibility, loading indicators |

---

## Redux Toolkit (RTK)

### Store Structure

```ts
// src/store/store.ts
export const store = configureStore({
  reducer: {
    auth:     authReducer,          // session, user, roles
    location: locationReducer,      // detected + overridden jurisdiction
    [recycleApi.reducerPath]: recycleApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(recycleApi.middleware),
});
```

### Slices

#### `authSlice`
```ts
interface AuthState {
  user: User | null;      // { uid, email, displayName, photoURL }
  roles: Role[];          // ['RESIDENT'] | ['MUNICIPALITY_MANAGER'] | ['ADMIN']
  token: string | null;   // Firebase ID token
  loading: boolean;
  error: string | null;
}
```

Actions: `setUser`, `clearUser`, `setToken`

#### `locationSlice`
```ts
interface LocationState {
  detected: Coordinates | null;      // { lat, lng } from browser geolocation
  resolved: Jurisdiction | null;     // { country, state, county, township }
  override: JurisdictionOverride | null;  // Manual zip/city input
  active: Jurisdiction | null;        // = override ?? resolved
  loading: boolean;
  error: string | null;
}
```

Actions: `setDetectedCoords`, `setResolvedJurisdiction`, `setOverride`, `clearOverride`

---

## RTK Query — API Layer

### API Slice Definition

```ts
// src/api/recycleApi.ts
export const recycleApi = createApi({
  reducerPath: 'recycleApi',
  baseQuery: axiosBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),
  tagTypes: ['Rules', 'Centers', 'Schedules', 'Lookup'],
  endpoints: (builder) => ({

    // Public endpoints
    lookupItem: builder.query<RecyclingResult[], LookupParams>({
      query: ({ item, lat, lng, zip }) =>
        `lookup?item=${item}&lat=${lat}&lng=${lng}&zip=${zip}`,
      providesTags: ['Lookup'],
    }),

    getPickupSchedule: builder.query<PickupSchedule, ScheduleParams>({
      query: ({ address, zip }) => `schedules?address=${address}&zip=${zip}`,
      providesTags: ['Schedules'],
    }),

    getDropoffCenters: builder.query<DropoffCenter[], CentersParams>({
      query: ({ lat, lng, material, radius }) =>
        `centers?lat=${lat}&lng=${lng}&material=${material}&radius=${radius}`,
      providesTags: ['Centers'],
    }),

    // Admin endpoints
    getRules: builder.query<PaginatedResponse<RecyclingRule>, RulesParams>({
      query: (params) => ({ url: 'admin/rules', params }),
      providesTags: ['Rules'],
    }),

    updateRule: builder.mutation<RecyclingRule, UpdateRulePayload>({
      query: ({ id, ...patch }) => ({
        url: `admin/rules/${id}`,
        method: 'PUT',
        data: patch,
      }),
      invalidatesTags: ['Rules'],
    }),

    createCenter: builder.mutation<DropoffCenter, CreateCenterPayload>({
      query: (data) => ({ url: 'admin/centers', method: 'POST', data }),
      invalidatesTags: ['Centers'],
    }),
  }),
});

export const {
  useLookupItemQuery,
  useGetPickupScheduleQuery,
  useGetDropoffCentersQuery,
  useGetRulesQuery,
  useUpdateRuleMutation,
  useCreateCenterMutation,
} = recycleApi;
```

### Caching Policy

| Endpoint | Cache Duration | Notes |
|---|---|---|
| `lookupItem` | 5 minutes | Jurisdiction-specific; invalidated on location change |
| `getPickupSchedule` | 1 hour | Address-level cache key |
| `getDropoffCenters` | 15 minutes | Radius + material as cache key |
| `getRules` (admin) | 2 minutes | Short TTL for frequently edited data |

---

## Zustand — Local Feature Stores

Zustand stores are colocated inside the feature folder they serve.

### `useDropoffStore`
```ts
// features/dropoff/dropoffStore.ts
interface DropoffStore {
  selectedMaterials: MaterialType[];   // active filter chips
  radius: 5 | 10 | 25;                // search radius in miles
  viewMode: 'map' | 'list';
  selectedCenterId: string | null;     // syncs map pin ↔ grid row
  mapBounds: LatLngBounds | null;
  setMaterials: (m: MaterialType[]) => void;
  setRadius: (r: 5 | 10 | 25) => void;
  setViewMode: (v: 'map' | 'list') => void;
  selectCenter: (id: string | null) => void;
  setMapBounds: (b: LatLngBounds) => void;
}

export const useDropoffStore = create<DropoffStore>((set) => ({
  selectedMaterials: [],
  radius: 10,
  viewMode: 'map',
  selectedCenterId: null,
  mapBounds: null,
  setMaterials: (selectedMaterials) => set({ selectedMaterials }),
  setRadius: (radius) => set({ radius }),
  setViewMode: (viewMode) => set({ viewMode }),
  selectCenter: (selectedCenterId) => set({ selectedCenterId }),
  setMapBounds: (mapBounds) => set({ mapBounds }),
}));
```

### `useAdminGridStore`
```ts
// features/admin/adminGridStore.ts
interface AdminGridStore {
  pendingEdits: Record<string, Partial<RecyclingRule>>;  // ruleId → changes
  selectedRowIds: string[];
  dirtyRowIds: Set<string>;
  addEdit: (ruleId: string, field: string, value: unknown) => void;
  clearEdit: (ruleId: string) => void;
  setSelectedRows: (ids: string[]) => void;
}
```

---

## React Context

Context is used only for cross-cutting concerns that don't warrant Redux overhead.

### `ThemeContext`
- Manages light/dark mode toggle (stored in `localStorage`)
- Wraps `<ThemeProvider>` from MUI

### `LocaleContext`
- Active language (`en`, `fr`, `de`, etc.)
- Date format, distance unit (miles / km)
- Passed to `react-i18next` `changeLanguage()`

---

## Custom Hooks

### `useLocation`
```ts
// Detects browser geolocation, dispatches to locationSlice
const { coords, permission, requesting } = useLocation();
```

### `useJurisdiction`
```ts
// Resolves active jurisdiction from RTK Query + Redux state
const { jurisdiction, loading } = useJurisdiction();
// Returns: { country: 'US', state: 'NJ', county: 'Hudson', township: 'Jersey City' }
```

### `usePickupDates`
```ts
// Returns Set<string> of ISO date strings with pickups (for calendar highlighting)
const { pickupDates, categoryByDate } = usePickupDates({ zip });
```

### `useAuth`
```ts
// Wraps Firebase Auth + Redux authSlice
const { user, token, roles, login, logout, loading } = useAuth();
```

---

## State Flow Diagrams

### Location Detection Flow
```
App mounts
  → useLocation() calls navigator.geolocation.getCurrentPosition()
  → dispatch(setDetectedCoords({ lat, lng }))
  → useJurisdiction() calls GET /location/resolve?lat=40.7&lng=-74.0
  → dispatch(setResolvedJurisdiction({ country, state, county, township }))
  → All RTK Query hooks re-fetch with new jurisdiction context
```

### Admin Rule Edit Flow
```
User double-clicks AG Grid cell
  → AG Grid calls onCellValueChanged callback
  → addEdit(ruleId, field, newValue) updates adminGridStore
  → Cell renders with "dirty" visual indicator
  → useUpdateRuleMutation() fires PUT /admin/rules/:id
  → On success: clearEdit(ruleId), invalidates ['Rules'] cache tag
  → On error: MUI Snackbar error toast; cell reverts to previous value
```

---

## Persistence

| State | Storage | Notes |
|---|---|---|
| Active location override | `localStorage` | Persists across sessions |
| Auth token | Firebase SDK (IndexedDB) | Managed by Firebase Auth |
| User preferences (locale, dark mode) | `localStorage` | Via Redux Persist or manual |
| AG Grid column state | `sessionStorage` | Per-session column width/order |
