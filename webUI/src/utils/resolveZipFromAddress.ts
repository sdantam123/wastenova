import { recycleApi } from '../api/recycleApi';
import { setPostalCode, setResolvedJurisdiction } from '../store/locationSlice';
import type { AppDispatch } from '../store/store';

/** Pulls the first 5-digit ZIP out of a free-text US address string. */
export function extractZipFromAddress(address: string | null | undefined): string | null {
  if (!address) return null;
  const match = address.match(/\b(\d{5})(?:-\d{4})?\b/);
  return match ? match[1] : null;
}

/**
 * Resolves a ZIP and, if it matches a known jurisdiction, sets it as the
 * active location — the same effect as using the ZIP lookup form, but run
 * automatically after login/registration so the user doesn't have to
 * re-enter it. Silently no-ops if the ZIP isn't recognized.
 *
 * Prefers an explicit ZIP (e.g. from the profile's postal_code field) over
 * one parsed out of the free-text address, since the explicit field is
 * unambiguous.
 */
export async function resolveZipFromAddress(
  dispatch: AppDispatch,
  address: string | null | undefined,
  postalCode?: string | null,
): Promise<void> {
  const zip = postalCode || extractZipFromAddress(address);
  if (!zip) return;

  try {
    const resolved = await dispatch(recycleApi.endpoints.resolveByPostal.initiate({ postalCode: zip, countryCode: 'US' })).unwrap();
    const jurisdictions = await dispatch(recycleApi.endpoints.getJurisdictions.initiate()).unwrap();
    const jurisdiction = jurisdictions.find((item) => item.id === resolved.jurisdiction_id)
      ?? jurisdictions.find((item) => item.postalCodes?.includes(zip));

    if (jurisdiction) {
      dispatch(setPostalCode(zip));
      dispatch(setResolvedJurisdiction(jurisdiction));
    }
  } catch {
    // ZIP not recognized or lookup failed — leave location unset, same as
    // an unresolved manual entry. The user can still set it from the top bar.
  }
}
