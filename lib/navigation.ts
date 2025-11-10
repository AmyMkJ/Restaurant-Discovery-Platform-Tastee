// Navigation utility functions

// Get navigation URL for Google Maps
export function getGoogleMapsDirections(
  destinationLat: number,
  destinationLng: number,
  destinationName?: string
): string {
  const destination = destinationName
    ? `${destinationLat},${destinationLng}`
    : `${destinationLat},${destinationLng}`
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`
}

// Get navigation URL for Apple Maps (works on iOS/Mac)
export function getAppleMapsDirections(
  destinationLat: number,
  destinationLng: number,
  destinationName?: string
): string {
  const destination = destinationName
    ? `${destinationName.replace(/\s+/g, '+')}`
    : `${destinationLat},${destinationLng}`
  return `https://maps.apple.com/?daddr=${destination}&dirflg=d`
}

// Open navigation in the best available app
export function openNavigation(
  destinationLat: number,
  destinationLng: number,
  destinationName?: string
) {
  // Detect if user is on iOS/Mac
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  if (isIOS) {
    window.open(getAppleMapsDirections(destinationLat, destinationLng, destinationName), '_blank')
  } else {
    window.open(
      getGoogleMapsDirections(destinationLat, destinationLng, destinationName),
      '_blank'
    )
  }
}

// Get general maps link (for fallback)
export function getMapsLink(
  destinationLat: number,
  destinationLng: number,
  destinationName?: string
): string {
  const encodedName = destinationName ? encodeURIComponent(destinationName) : ''
  return `https://www.google.com/maps/search/?api=1&query=${destinationLat},${destinationLng}${encodedName ? `&query_place_id=${encodedName}` : ''}`
}


