'use client'

import { useState, useCallback } from 'react'
import Map, { Marker, ViewState } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

interface LocationPickerProps {
  initialLatitude?: number
  initialLongitude?: number
  initialZoom?: number
  onLocationChange?: (location: { lat: number; lng: number }) => void
  height?: string
}

export default function LocationPicker({
  initialLatitude = 43.6532,
  initialLongitude = -79.3832,
  initialZoom = 12,
  onLocationChange,
  height = '400px',
}: LocationPickerProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: initialLongitude,
    latitude: initialLatitude,
    zoom: initialZoom,
  })

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
  }>({
    lat: initialLatitude,
    lng: initialLongitude,
  })

  const handleMapClick = useCallback(
    (event: { lngLat: { lng: number; lat: number } }) => {
      const newLocation = {
        lat: event.lngLat.lat,
        lng: event.lngLat.lng,
      }
      setSelectedLocation(newLocation)
      onLocationChange?.(newLocation)
    },
    [onLocationChange]
  )

  if (!mapboxToken || mapboxToken === 'your_mapbox_token_here') {
    return (
      <div className="flex items-center justify-center bg-gray-100" style={{ height }}>
        <p className="text-gray-600">Please configure Mapbox Token</p>
      </div>
    )
  }

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapboxAccessToken={mapboxToken}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <Marker longitude={selectedLocation.lng} latitude={selectedLocation.lat} anchor="center">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
        </Marker>
      </Map>
      <div className="mt-2 text-sm text-gray-600 text-center">
        Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
      </div>
    </div>
  )
}

