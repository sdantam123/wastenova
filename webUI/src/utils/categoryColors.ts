import type { RecyclingCategory } from '../types/recycling';

/** Maps a RecyclingCategory to its MUI color name */
export const categoryToColor: Record<RecyclingCategory, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  CURBSIDE: 'success',
  COMPOST: 'success',
  REUSE: 'info',
  DROPOFF_CENTER: 'warning',
  MEDICAL_DROPOFF: 'error',
  HAZARDOUS: 'error',
  NOT_RECYCLABLE: 'default',
};

/** Human-readable label for each category */
export const categoryLabel: Record<RecyclingCategory, string> = {
  CURBSIDE: 'Curbside Recycling',
  DROPOFF_CENTER: 'Drop-off Required',
  MEDICAL_DROPOFF: 'Medical Drop-off',
  HAZARDOUS: 'Hazardous Drop-off',
  COMPOST: 'Compost',
  NOT_RECYCLABLE: 'Not Recyclable',
  REUSE: 'Reuse / Donate',
};
