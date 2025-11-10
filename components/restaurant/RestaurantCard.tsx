'use client'

import type { Restaurant } from '@/types'
import Link from 'next/link'
import { formatDistance, formatTime, calculateWalkingTime, calculateDrivingTime } from '@/lib/utils'
import { openNavigation } from '@/lib/navigation'
import { useFavorites } from '@/lib/context/FavoritesContext'

interface RestaurantCardProps {
  restaurant: Restaurant & { distance?: number | null }
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const priceRanges = ['$10-15', '$15-30', '$30-50', '$50+']

  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(restaurant.id)

  const handleToggleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const { distance, ...sanitizedRestaurant } = restaurant
    toggleFavorite(sanitizedRestaurant as Restaurant)
  }

  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="relative block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <button
        onClick={handleToggleFavorite}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        className={`absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full shadow-md transition-colors ${
          favorite ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 hover:bg-orange-50'
        }`}
      >
        <svg
          className="w-5 h-5"
          fill={favorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>

      {/* Restaurant Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
        <span className="text-white text-sm font-semibold drop-shadow">{restaurant.name}</span>
      </div>

      <div className="p-4">
        {/* Name and Rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{restaurant.name}</h3>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-gray-700 font-medium">{restaurant.averageRating}</span>
            <span className="text-gray-500 text-sm">({restaurant.reviewCount})</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {restaurant.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price and Status */}
        <div className="flex justify-between items-center mt-3">
          <span className="text-gray-700 font-medium text-sm">
            {priceRanges[restaurant.priceRange - 1]} per person
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              restaurant.isOpen
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        {/* Distance and Time (if available) */}
        {restaurant.distance !== null && restaurant.distance !== undefined && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium">{formatDistance(restaurant.distance)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>{formatTime(calculateWalkingTime(restaurant.distance))} walk</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>{formatTime(calculateDrivingTime(restaurant.distance))} drive</span>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                openNavigation(
                  restaurant.location.latitude,
                  restaurant.location.longitude,
                  restaurant.name
                )
              }}
              className="w-full mt-2 px-3 py-2 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
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
              Get Directions
            </button>
          </div>
        )}

        {/* Address */}
        <p className="text-gray-500 text-sm mt-2 truncate">{restaurant.location.address}</p>
      </div>
    </Link>
  )
}

