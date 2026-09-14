import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Coordinates, Jurisdiction, JurisdictionOverride } from '../types/jurisdiction';

interface LocationState {
  detected: Coordinates | null;
  resolved: Jurisdiction | null;
  override: JurisdictionOverride | null;
  postalCode: string | null;
  active: Jurisdiction | null;
  loading: boolean;
  error: string | null;
}

const initialState: LocationState = {
  detected: null,
  resolved: null,
  override: null,
  postalCode: null,
  active: null,
  loading: false,
  error: null,
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setDetectedCoords: (state, action: PayloadAction<Coordinates>) => {
      state.detected = action.payload;
    },
    setResolvedJurisdiction: (state, action: PayloadAction<Jurisdiction>) => {
      state.resolved = action.payload;
      if (!state.override) state.active = action.payload;
    },
    setPostalCode: (state, action: PayloadAction<string | null>) => {
      state.postalCode = action.payload;
    },
    setOverride: (state, action: PayloadAction<{ override: JurisdictionOverride; resolved: Jurisdiction }>) => {
      state.override = action.payload.override;
      state.active = action.payload.resolved;
      state.postalCode = action.payload.override.zip ?? state.postalCode;
    },
    clearOverride: (state) => {
      state.override = null;
      state.active = state.resolved;
    },
    setLocationLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLocationError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearLocation: () => initialState,
  },
});

export const {
  setDetectedCoords,
  setResolvedJurisdiction,
  setPostalCode,
  setOverride,
  clearOverride,
  setLocationLoading,
  setLocationError,
  clearLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
