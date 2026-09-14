import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store/store';
import type { Jurisdiction } from '../types/jurisdiction';
import type { DropoffCenter, PickupEvent, RecyclingResult } from '../types/recycling';

export const apiOrigin = (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000').replace(/\/$/, '');
const apiBaseUrl = `${apiOrigin}/`;

export interface LookupParams {
  item: string;
  jurisdictionId: string;
}

export interface CentersParams {
  lat: number;
  lng: number;
  material?: string;
  radius?: 5 | 10 | 25 | 50;
  jurisdictionId?: string;
}

export interface ResolvePostalParams {
  postalCode: string;
  countryCode?: string;
}

export interface ScheduleParams {
  jurisdictionId: string;
  from?: string;
  to?: string;
}

export interface CenterSearchParams {
  q: string;
  jurisdictionId?: string;
}

export interface ProgramsParams {
  materialCategory?: string;
  programType?: string;
  jurisdictionId?: string;
}

export interface SourceDocumentsParams {
  jurisdictionId?: string;
  categoryKey?: string;
}

export interface ServerSourceDocument {
  id: number;
  title: string;
  download_url: string;
  document_type: 'PDF' | 'IMAGE';
  category_key: string | null;
  source_url: string | null;
  jurisdiction_id: string | null;
  publication_year: number | null;
  file_size_bytes: number | null;
  notes: string | null;
}

export interface AuthPayload {
  email: string;
  password: string;
  name?: string;
  address?: string;
  postal_code?: string;
}

interface ServerJurisdiction {
  id: string;
  country: string;
  state: string | null;
  county: string | null;
  township: string | null;
  postal_codes: string[] | null;
}

interface ServerResolvedLocation {
  jurisdiction_id: string;
  postal_code: string | null;
  country: string;
  state: string | null;
  county: string | null;
  township: string | null;
}

interface ServerLookupResult {
  id: string;
  item_name: string;
  material_code: string | null;
  recyclable: boolean;
  category: RecyclingResult['category'];
  preparation_steps: string[];
  notes: string;
  jurisdiction_name: string;
}

interface ServerCalendarEvent {
  date: string;
  type: string;
  materials: string[];
  notes: string | null;
}

interface ServerCalendarResponse {
  schedule: ServerCalendarEvent[];
}

interface ServerCenterHours {
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  notes: string | null;
}

export interface ServerDropoffCenter {
  id: number;
  name: string;
  center_type: string;
  program_name: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string | null;
  country_code: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  website: string | null;
  email: string | null;
  accepted_materials: string[];
  not_accepted: string[] | null;
  is_active: boolean | null;
  hours: ServerCenterHours[];
  distance_miles?: number | null;
  is_temporary?: boolean | null;
  event_date?: string | null;
}

export interface ServerProgramLocation {
  location_name: string;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  notes: string | null;
  event_date: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface ServerRecyclingProgram {
  id: number;
  material_category: string;
  program_name: string;
  organization: string;
  program_type: string;
  accepts: string[] | null;
  not_accepted: string[] | null;
  how_it_works: string | null;
  incentive: string | null;
  website: string | null;
  jurisdiction_id: string | null;
  is_active: boolean | null;
  locations: ServerProgramLocation[];
}

export interface NewCenterPayload {
  name: string;
  center_type: string;
  program_name?: string | null;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state?: string | null;
  postal_code?: string | null;
  country_code?: string;
  latitude: number;
  longitude: number;
  phone?: string | null;
  website?: string | null;
  email?: string | null;
  accepted_materials: string[];
  not_accepted?: string[] | null;
  is_active?: boolean | null;
}

interface ServerAuthUser {
  id: number;
  name: string | null;
  email: string | null;
  address: string | null;
  postal_code: string | null;
}

interface ServerAuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: ServerAuthUser;
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

function displayName(parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(', ');
}

function normalizeMaterial(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/_+/g, '_');
}

function mapJurisdiction(item: ServerJurisdiction): Jurisdiction {
  return {
    id: item.id,
    country: item.country,
    state: item.state ?? '',
    county: item.county ?? '',
    township: item.township ?? '',
    displayName: displayName([item.township, item.county, item.state, item.country]),
    postalCodes: item.postal_codes ?? [],
  };
}

function mapLookupResult(item: ServerLookupResult): RecyclingResult {
  return {
    id: item.id,
    itemName: item.item_name,
    material: normalizeMaterial(item.material_code ?? item.item_name) as RecyclingResult['material'],
    recyclable: item.recyclable,
    category: item.category,
    preparationSteps: item.preparation_steps,
    notes: item.notes,
    jurisdictionName: item.jurisdiction_name,
  };
}

function mapSchedule(response: ServerCalendarResponse): PickupEvent[] {
  return response.schedule.map((event) => ({
    date: event.date,
    type: event.type === 'TRASH' ? 'GENERAL' : event.type === 'BULK_PICKUP' ? 'BULK' : (event.type as PickupEvent['type']),
    label: event.materials.join(', '),
    delayReason: event.notes ?? undefined,
  }));
}

function mapHours(hours: ServerCenterHours[]): Record<string, string> {
  return hours.reduce<Record<string, string>>((accumulator, hour) => {
    const label = dayNames[hour.day_of_week] ?? `Day ${hour.day_of_week}`;
    accumulator[label] = hour.open_time && hour.close_time ? `${hour.open_time.slice(0, 5)}-${hour.close_time.slice(0, 5)}` : (hour.notes ?? 'Closed');
    return accumulator;
  }, {});
}

function mapCenter(item: ServerDropoffCenter): DropoffCenter {
  return {
    id: item.id,
    name: item.name,
    address: [item.address_line1, item.address_line2, item.city, item.state, item.postal_code].filter(Boolean).join(', '),
    city: item.city,
    state: item.state ?? undefined,
    zip: item.postal_code ?? undefined,
    phone: item.phone ?? undefined,
    website: item.website ?? undefined,
    lat: item.latitude,
    lng: item.longitude,
    location: { lat: item.latitude, lng: item.longitude },
    distanceMiles: item.distance_miles ?? undefined,
    acceptedMaterials: item.accepted_materials.map(normalizeMaterial),
    hours: mapHours(item.hours),
    hoursDetail: item.hours.map((hour) => ({
      dayOfWeek: hour.day_of_week,
      openTime: hour.open_time,
      closeTime: hour.close_time,
      notes: hour.notes,
    })),
    isTemporary: item.is_temporary ?? undefined,
    eventDate: item.event_date ?? undefined,
  };
}

export const recycleApi = createApi({
  reducerPath: 'recycleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Jurisdictions', 'Centers', 'Schedules', 'Lookup', 'Auth', 'Programs'],
  endpoints: (builder) => ({
    getJurisdictions: builder.query<Jurisdiction[], void>({
      query: () => ({ url: 'jurisdictions' }),
      transformResponse: (response: ServerJurisdiction[]) => response.map(mapJurisdiction),
      providesTags: ['Jurisdictions'],
    }),

    resolveByPostal: builder.query<ServerResolvedLocation, ResolvePostalParams>({
      query: (params) => ({ url: 'location/resolve-by-postal', params }),
      providesTags: ['Jurisdictions'],
    }),

    lookupItem: builder.query<RecyclingResult[], LookupParams>({
      query: (params) => ({ url: 'lookup', params }),
      transformResponse: (response: ServerLookupResult[]) => response.map(mapLookupResult),
      providesTags: ['Lookup'],
    }),

    getPickupSchedule: builder.query<PickupEvent[], ScheduleParams>({
      query: ({ jurisdictionId, ...params }) => ({ url: `calendar/${jurisdictionId}`, params }),
      transformResponse: (response: ServerCalendarResponse) => mapSchedule(response),
      providesTags: ['Schedules'],
      keepUnusedDataFor: 3600,
    }),

    getDropoffCenters: builder.query<DropoffCenter[], CentersParams>({
      query: (params) => ({ url: 'centers', params }),
      transformResponse: (response: ServerDropoffCenter[]) => response.map(mapCenter),
      providesTags: ['Centers'],
      keepUnusedDataFor: 900,
    }),

    getPrograms: builder.query<ServerRecyclingProgram[], ProgramsParams | void>({
      query: (params) => ({ url: 'programs', params: params ?? undefined }),
      providesTags: ['Programs'],
      keepUnusedDataFor: 3600,
    }),

    searchCenters: builder.query<DropoffCenter[], CenterSearchParams>({
      query: (params) => ({ url: 'centers/search', params }),
      transformResponse: (response: ServerDropoffCenter[]) => response.map(mapCenter),
      providesTags: ['Centers'],
      keepUnusedDataFor: 900,
    }),

    getSourceDocuments: builder.query<ServerSourceDocument[], SourceDocumentsParams | void>({
      query: (params) => ({ url: 'source-documents', params: params ?? undefined }),
      keepUnusedDataFor: 3600,
    }),

    getAdminCenters: builder.query<ServerDropoffCenter[], void>({
      query: () => ({ url: 'centers/admin' }),
      providesTags: ['Centers'],
    }),

    createCenter: builder.mutation<ServerDropoffCenter, NewCenterPayload>({
      query: (body) => ({ url: 'centers', method: 'POST', body }),
      invalidatesTags: ['Centers'],
    }),

    updateCenter: builder.mutation<ServerDropoffCenter, { id: number; payload: Partial<NewCenterPayload> }>({
      query: ({ id, payload }) => ({ url: `centers/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Centers'],
    }),

    deleteCenter: builder.mutation<void, number>({
      query: (id) => ({ url: `centers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Centers'],
    }),

    login: builder.mutation<ServerAuthResponse, AuthPayload>({
      query: (body) => ({ url: 'auth/login', method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),

    register: builder.mutation<ServerAuthResponse, AuthPayload>({
      query: (body) => ({ url: 'auth/register', method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useGetJurisdictionsQuery,
  useLazyResolveByPostalQuery,
  useLazyLookupItemQuery,
  useLazyGetPickupScheduleQuery,
  useGetDropoffCentersQuery,
  useGetProgramsQuery,
  useSearchCentersQuery,
  useGetSourceDocumentsQuery,
  useGetAdminCentersQuery,
  useCreateCenterMutation,
  useUpdateCenterMutation,
  useDeleteCenterMutation,
  useLoginMutation,
  useRegisterMutation,
} = recycleApi;
