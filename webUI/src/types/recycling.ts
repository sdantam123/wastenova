export type RecyclingCategory =
  | 'CURBSIDE'
  | 'DROPOFF_CENTER'
  | 'MEDICAL_DROPOFF'
  | 'HAZARDOUS'
  | 'COMPOST'
  | 'NOT_RECYCLABLE'
  | 'REUSE';

export type MaterialType =
  | 'PLASTIC'
  | 'GLASS'
  | 'METAL'
  | 'PAPER'
  | 'CARDBOARD'
  | 'ELECTRONICS'
  | 'BATTERIES'
  | 'PAINT'
  | 'MEDICATIONS'
  | 'SHARPS'
  | 'MOTOR_OIL'
  | 'TEXTILES'
  | 'ORGANIC';

export interface RecyclingResult {
  id: string;
  itemName: string;
  material: MaterialType;
  recyclable: boolean;
  category: RecyclingCategory;
  preparationSteps: string[];
  notes: string;
  jurisdictionName: string;
}

export interface RecyclingRule {
  id: string;
  jurisdiction: string;
  state: string;
  county: string;
  township: string;
  material: MaterialType;
  category: RecyclingCategory;
  instructions: string;
  acceptedItems: string[];
  rejectedItems: string[];
  lastUpdated: string;
  status: 'DRAFT' | 'PUBLISHED';
}

export interface DropoffCenterHoursEntry {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  notes: string | null;
}

export interface DropoffCenter {
  id: number;
  name: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  website?: string;
  lat?: number;
  lng?: number;
  distanceMiles?: number;
  acceptedMaterials: string[];
  hours?: Record<string, string>;
  /** Raw per-row hours (one entry per day+note combination) — use this when hours need to be filtered by category/material, since `hours` collapses multiple rows per day into one string. */
  hoursDetail?: DropoffCenterHoursEntry[];
  isOpen?: boolean;
  temporarilyClosed?: boolean;
  reopenDate?: string;
  notes?: string;
  /** True if this row represents a single-day dated event rather than a standing drop-off site (e.g. an annual bulk-waste collection day). */
  isTemporary?: boolean;
  /** The one-off date this center is open, set only when isTemporary is true. */
  eventDate?: string;
  /** Convenience alias for {lat, lng} — used by map components */
  location?: { lat: number; lng: number };
}

export interface PickupSchedule {
  address: string;
  zip: string;
  collections: PickupEvent[];
}

export interface PickupEvent {
  date: string;           // ISO date string
  type: 'RECYCLING' | 'YARD_WASTE' | 'CARDBOARD' | 'BULK' | 'GENERAL';
  label: string;
  delayed?: boolean;
  delayReason?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
