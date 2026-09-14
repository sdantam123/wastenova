export interface CategoryNavItem {
  key: string;
  label: string;
  /** Keywords matched (case-insensitively) against program material_category/accepts/name and center accepted_materials/hours notes. */
  keywords: string[];
  /** If set, selecting this item navigates here instead of filtering in place. */
  linkTo?: string;
  /** If true, this item shows the user's resolved location details instead of programs/centers. */
  isLocationInfo?: boolean;
  /** If true, the generic Programs list is not shown for this category (e.g. when the matched programs are unrelated/noisy and an external resource is preferred instead). */
  hidePrograms?: boolean;
  /** An external resource link shown in place of (or alongside) the Programs list. */
  externalLink?: { label: string; url: string };
}

export const categoryNavItems: CategoryNavItem[] = [
  { key: 'home', label: 'Home', keywords: [], isLocationInfo: true },
  {
    key: 'balloon',
    label: 'Balloon',
    keywords: ['balloon'],
    hidePrograms: true,
    externalLink: { label: 'balloonmission.org', url: 'https://www.balloonmission.org' },
  },
  { key: 'bulk-waste', label: 'Bulk Waste', keywords: ['bulk'] },
  { key: 'cooking-oil', label: 'Cooking Oil', keywords: ['cooking oil'] },
  { key: 'curbside', label: 'Curbside Recycling', keywords: [], linkTo: '/calendar' },
  { key: 'electronics', label: 'Electronics', keywords: ['electronic', 'e-waste', 'computer', 'television'] },
  { key: 'hhw', label: 'Household Hazardous', keywords: ['household hazardous', 'hazardous waste', 'hhw'] },
  { key: 'medical', label: 'Medical Disposal', keywords: ['medicine', 'medication', 'pharmaceutical', 'prescription', 'medical'] },
  { key: 'paint', label: 'Paint', keywords: ['paint'] },
  { key: 'paper-shredding', label: 'Paper Shredding', keywords: ['paper shredding', 'shredding'] },
  {
    key: 'battery',
    label: 'Rechargeable Battery',
    keywords: ['rechargeable batter', 'battery', 'batteries'],
    hidePrograms: true,
    externalLink: { label: 'batterynetwork.org', url: 'https://batterynetwork.org' },
  },
  { key: 'syringe', label: 'Syringe Disposal', keywords: ['syringe', 'sharps', 'needle'] },
  { key: 'textile', label: 'Textile', keywords: ['textile', 'clothing', 'shoes'] },
  { key: 'tire', label: 'Tire', keywords: ['tire'] },
];
