'use client'

import { useState, useCallback } from 'react'
import Map, { Marker, Popup, ViewState } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

// Restaurant marker type (example)
export interface RestaurantMarker {
  id: string
  name: string
  latitude: number
  longitude: number
  description?: string
}

interface MapViewProps {
  initialLatitude?: number
  initialLongitude?: number
  initialZoom?: number
  markers?: RestaurantMarker[]
  onMarkerClick?: (marker: RestaurantMarker) => void
  onMapClick?: (event: { lngLat: { lng: number; lat: number } }) => void
  height?: string
}

export default function MapView({
  initialLatitude = 43.6532, // Default Toronto
  initialLongitude = -79.3832,
  initialZoom = 12,
  markers = [],
  onMarkerClick,
  onMapClick,
  height = '600px',
}: MapViewProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  if (!mapboxToken || mapboxToken === 'your_mapbox_token_here') {
    return (
      <div className="flex items-center justify-center bg-gray-100" style={{ height }}>
        <div className="text-center p-8">
          <p className="text-lg font-semibold mb-2">Map Not Configured</p>
          <p className="text-sm text-gray-600">
            Please set <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code>
            <br />
            <code>NEXT_PUBLIC_MAPBOX_TOKEN</code>
          </p>
          <p className="text-xs text-gray-500 mt-4">
            Get Token: <a href="https://account.mapbox.com/access-tokens/" className="text-blue-500 underline" target="_blank">mapbox.com</a>
          </p>
        </div>
      </div>
    )
  }

  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: initialLongitude,
    latitude: initialLatitude,
    zoom: initialZoom,
  })

  const [selectedMarker, setSelectedMarker] = useState<RestaurantMarker | null>(null)

  const handleMarkerClick = useCallback(
    (marker: RestaurantMarker) => {
      setSelectedMarker(marker)
      onMarkerClick?.(marker)
    },
    [onMarkerClick]
  )

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={onMapClick}
        mapboxAccessToken={mapboxToken}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {/* Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
            onClick={(e: { originalEvent: MouseEvent }) => {
              e.originalEvent.stopPropagation()
              handleMarkerClick(marker)
            }}
          >
            <div className="cursor-pointer">
              <svg
                width="32"
                height="40"
                viewBox="0 0 24 24"
                fill="#ef4444"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
          </Marker>
        ))}

        {/* Popup info window */}
        {selectedMarker && (
          <Popup
            longitude={selectedMarker.longitude}
            latitude={selectedMarker.latitude}
            anchor="bottom"
            onClose={() => setSelectedMarker(null)}
            closeOnClick={false}
          >
            <div className="p-2">
              <h3 className="font-semibold text-sm">{selectedMarker.name}</h3>
              {selectedMarker.description && (
                <p className="text-xs text-gray-600 mt-1">{selectedMarker.description}</p>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}

