// Calculate distance between two coordinates (in km) using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

// Calculate walking time (assuming average walking speed of 5 km/h)
export function calculateWalkingTime(distanceKm: number): number {
  const walkingSpeedKmh = 5
  return (distanceKm / walkingSpeedKmh) * 60 // Return in minutes
}

// Calculate driving time (assuming average speed of 40 km/h in city)
export function calculateDrivingTime(distanceKm: number): number {
  const drivingSpeedKmh = 40
  return (distanceKm / drivingSpeedKmh) * 60 // Return in minutes
}

// Format distance for display
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  }
  return `${km.toFixed(1)}km`
}

// Format time for display
export function formatTime(minutes: number): string {
  if (minutes < 1) {
    return '< 1 min'
  }
  if (minutes < 60) {
    return `${Math.round(minutes)} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (mins === 0) {
    return `${hours} hr`
  }
  return `${hours} hr ${mins} min`
}


