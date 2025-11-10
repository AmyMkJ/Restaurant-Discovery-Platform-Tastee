'use client'

import { useState, useEffect } from 'react'

export interface UserLocation {
  latitude: number
  longitude: number
}

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setIsLoading(false)
      },
      (err) => {
        setError(err.message)
        setIsLoading(false)
        // Default to Toronto downtown if location access denied
        setLocation({
          latitude: 43.6532,
          longitude: -79.3832,
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    )
  }, [])

  return { location, isLoading, error }
}


