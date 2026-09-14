/** Builds a Google Maps URL that opens turn-by-turn directions to a destination. */
export function getDirectionsUrl(destination: { lat?: number; lng?: number; address?: string }): string {
  const query = destination.lat != null && destination.lng != null
    ? `${destination.lat},${destination.lng}`
    : destination.address ?? '';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}
