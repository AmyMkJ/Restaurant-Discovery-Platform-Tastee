'use client'

import { useState } from 'react'
import MapView, { RestaurantMarker } from '@/components/map/MapView'
import LocationPicker from '@/components/map/LocationPicker'

export default function MapDemoPage() {
  // Sample restaurant data
  const [restaurants] = useState<RestaurantMarker[]>([
    {
      id: '1',
      name: 'Pizza Palace',
      latitude: 43.6532,
      longitude: -79.3832,
      description: 'Delicious Italian pizza',
    },
    {
      id: '2',
      name: 'Sushi World',
      latitude: 43.654,
      longitude: -79.384,
      description: 'Fresh Japanese cuisine',
    },
    {
      id: '3',
      name: 'Burger King',
      latitude: 43.652,
      longitude: -79.382,
      description: 'Classic American burgers',
    },
  ])

  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    null
  )

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Map Feature Demo</h1>

      {/* Map displaying restaurant markers */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Restaurant Map</h2>
        <p className="text-gray-600 mb-4">Click on markers to view restaurant information</p>
        <MapView
          initialLatitude={43.6532}
          initialLongitude={-79.3832}
          initialZoom={13}
          markers={restaurants}
          onMarkerClick={(marker) => {
            console.log('Clicked restaurant:', marker)
            alert(`Clicked: ${marker.name}`)
          }}
          height="500px"
        />
      </section>

      {/* Location picker */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Location Picker</h2>
        <p className="text-gray-600 mb-4">Click on the map to select a location</p>
        <LocationPicker
          onLocationChange={(location) => {
            setSelectedLocation(location)
            console.log('Selected location:', location)
          }}
          height="400px"
        />
        {selectedLocation && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="font-semibold">Selected Location:</p>
            <p>Latitude: {selectedLocation.lat.toFixed(6)}</p>
            <p>Longitude: {selectedLocation.lng.toFixed(6)}</p>
          </div>
        )}
      </section>
    </div>
  )
}

