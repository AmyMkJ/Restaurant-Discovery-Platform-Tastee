'use client'

import { useState, useEffect } from 'react'
import RestaurantList from '@/components/restaurant/RestaurantList'
import SearchBar from '@/components/search/SearchBar'
import MapView, { RestaurantMarker } from '@/components/map/MapView'
import { useUserLocation } from '@/lib/hooks/useUserLocation'
import {
  calculateDistance,
  calculateWalkingTime,
  calculateDrivingTime,
  formatDistance,
  formatTime,
} from '@/lib/utils'
import type { Restaurant, SearchFilters } from '@/types'
import { mockRestaurants } from '@/lib/mockData'

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [sortBy, setSortBy] = useState<string>('popularity')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [currentPage, setCurrentPage] = useState(1)

  // Get user location
  const { location: userLocation, isLoading: locationLoading } = useUserLocation()

  // Get all unique tags for filter
  const allTags = Array.from(
    new Set(mockRestaurants.flatMap((r) => r.tags))
  ).sort()

  // Calculate distance for each restaurant
  const restaurantsWithDistance = restaurants.map((restaurant) => {
    if (!userLocation) return { ...restaurant, distance: null }
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      restaurant.location.latitude,
      restaurant.location.longitude
    )
    return { ...restaurant, distance }
  })

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      let filtered = [...mockRestaurants]

      // Filter by search query
      if (filters.query) {
        const query = filters.query.toLowerCase()
        filtered = filtered.filter(
          (r) =>
            r.name.toLowerCase().includes(query) ||
            r.description?.toLowerCase().includes(query) ||
            r.tags.some((tag) => tag.toLowerCase().includes(query))
        )
      }

      // Filter by tags
      if (filters.tags && filters.tags.length > 0) {
        filtered = filtered.filter((r) =>
          filters.tags!.some((tag) => r.tags.includes(tag))
        )
      }

      // Filter by price range
      if (filters.priceRange && filters.priceRange.length > 0) {
        filtered = filtered.filter((r) =>
          filters.priceRange!.includes(r.priceRange)
        )
      }

      // Filter by open status
      if (filters.isOpen !== undefined) {
        filtered = filtered.filter((r) => r.isOpen === filters.isOpen)
      }

      // Filter by distance (if user location available)
      if (userLocation && filters.maxDistance) {
        filtered = filtered.filter((r) => {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            r.location.latitude,
            r.location.longitude
          )
          return distance <= filters.maxDistance!
        })
      }

      // Sort
      switch (sortBy) {
        case 'popularity':
          filtered.sort((a, b) => b.reviewCount - a.reviewCount)
          break
        case 'rating':
          filtered.sort((a, b) => b.averageRating - a.averageRating)
          break
        case 'price-low':
          filtered.sort((a, b) => a.priceRange - b.priceRange)
          break
        case 'price-high':
          filtered.sort((a, b) => b.priceRange - a.priceRange)
          break
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'distance':
          if (userLocation) {
            filtered.sort((a, b) => {
              const distA = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                a.location.latitude,
                a.location.longitude
              )
              const distB = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                b.location.latitude,
                b.location.longitude
              )
              return distA - distB
            })
          }
          break
      }

      setRestaurants(filtered)
      setCurrentPage(1) // Reset to first page when filters change
      setIsLoading(false)
    }, 300)
  }, [filters, sortBy, userLocation])

  const handleSearch = (query: string) => {
    setFilters({ ...filters, query })
  }

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag]
    setFilters({ ...filters, tags: newTags })
  }

  const togglePriceRange = (range: number) => {
    const currentRanges = filters.priceRange || []
    const newRanges = currentRanges.includes(range)
      ? currentRanges.filter((r) => r !== range)
      : [...currentRanges, range]
    setFilters({ ...filters, priceRange: newRanges })
  }

  const toggleOpenFilter = () => {
    setFilters({
      ...filters,
      isOpen: filters.isOpen === undefined ? true : undefined,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurants in Toronto</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-4 text-gray-700">Filters</h2>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Price Range</h3>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((range) => {
                  const priceRanges = [
                    '$10-15',
                    '$15-30',
                    '$30-50',
                    '$50+',
                  ]
                  return (
                    <label key={range} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.priceRange?.includes(range) || false}
                        onChange={() => togglePriceRange(range)}
                        className="mr-2"
                      />
                      <span className="text-gray-700 text-sm">
                        {priceRanges[range - 1]} per person
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Cuisine Types */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Cuisine</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allTags.map((tag) => (
                  <label key={tag} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.tags?.includes(tag) || false}
                      onChange={() => toggleTag(tag)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Distance Filter */}
            {userLocation && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-700">Distance from me</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {[1, 2, 5, 10, 15, 20, 25, 30, 40, 50].map((km) => (
                    <label key={km} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="distance"
                        checked={filters.maxDistance === km}
                        onChange={() => setFilters({ ...filters, maxDistance: km })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Within {km} km</span>
                    </label>
                  ))}
                  {filters.maxDistance && (
                    <button
                      onClick={() => setFilters({ ...filters, maxDistance: undefined })}
                      className="text-xs text-orange-600 hover:underline mt-2 block"
                    >
                      Clear distance filter
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Open Status */}
            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isOpen === true}
                  onChange={toggleOpenFilter}
                  className="mr-2"
                />
                <span className="text-gray-700">Open Now</span>
              </label>
            </div>

            {/* Clear Filters */}
            {(filters.tags?.length ||
              filters.priceRange?.length ||
              filters.isOpen ||
              filters.maxDistance) && (
              <button
                onClick={() => setFilters({ query: filters.query })}
                className="mt-4 w-full text-orange-600 hover:underline text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort Controls and View Toggle */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-600">
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <p>
                  Showing {Math.min((currentPage - 1) * 20 + 1, restaurants.length)}-
                  {Math.min(currentPage * 20, restaurants.length)} of {restaurants.length} restaurants
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 transition-colors ${
                    viewMode === 'map'
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </button>
              </div>
              {/* Sort Select */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                {userLocation && <option value="distance">Distance (Nearby First)</option>}
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Restaurant List or Map View */}
          {viewMode === 'list' ? (
            <RestaurantList
              restaurants={restaurantsWithDistance}
              isLoading={isLoading || locationLoading}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          ) : (
            <div className="bg-white rounded-lg overflow-hidden shadow-md" style={{ height: '600px' }}>
              <MapView
                initialLatitude={userLocation?.latitude || 43.6532}
                initialLongitude={userLocation?.longitude || -79.3832}
                initialZoom={userLocation ? 13 : 12}
                markers={[
                  ...restaurants.map(
                    (r) =>
                      ({
                        id: r.id,
                        name: r.name,
                        latitude: r.location.latitude,
                        longitude: r.location.longitude,
                        description: r.description,
                      } as RestaurantMarker)
                  ),
                  ...(userLocation
                    ? [
                        {
                          id: 'user-location',
                          name: 'Your Location',
                          latitude: userLocation.latitude,
                          longitude: userLocation.longitude,
                          description: 'You are here',
                        } as RestaurantMarker,
                      ]
                    : []),
                ]}
                onMarkerClick={(marker) => {
                  if (marker.id !== 'user-location') {
                    window.location.href = `/restaurants/${marker.id}`
                  }
                }}
                height="100%"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
