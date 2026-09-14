export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Jurisdiction {
  id: string;
  country: string;
  state: string;
  county: string;
  township: string;
  displayName: string;
  postalCodes?: string[];
}

export interface JurisdictionOverride {
  zip?: string;
  city?: string;
  state?: string;
}
