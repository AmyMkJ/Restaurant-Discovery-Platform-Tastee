'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { Restaurant, Review } from '@/types'
import { mockRestaurants, mockReviews } from '@/lib/mockData'
import MapView, { RestaurantMarker } from '@/components/map/MapView'
import { openNavigation } from '@/lib/navigation'
import Pagination from '@/components/common/Pagination'
import { useFavorites } from '@/lib/context/FavoritesContext'
import { rateLimiter } from '@/lib/utils/rateLimiter'

export default function RestaurantDetailPage() {
  const params = useParams()
  const restaurantId = params?.id as string

  const { isFavorite, toggleFavorite } = useFavorites()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reportedReviewIds, setReportedReviewIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 20
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedReviews = reviews.slice(startIndex, endIndex)
  // Ensure at least 1 page, even if no reviews
  const totalPages = Math.max(1, Math.ceil(reviews.length / ITEMS_PER_PAGE))

  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadReported = () => {
      try {
        const stored = localStorage.getItem('reportedReviews')
        if (!stored) {
          setReportedReviewIds([])
          return
        }
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setReportedReviewIds(parsed)
        }
      } catch (error) {
        console.error('Failed to load reported reviews', error)
      }
    }

    loadReported()

    const handleStorageChange = () => loadReported()
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('reported-reviews-update', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('reported-reviews-update', handleStorageChange)
    }
  }, [])

  useEffect(() => {
    // Simulate API call
    setIsLoading(true)
    setTimeout(() => {
      const found = mockRestaurants.find((r) => r.id === restaurantId)
      setRestaurant(found || null)
      setReviews(mockReviews.filter((r) => r.restaurantId === restaurantId))
      setIsLoading(false)
    }, 500)
  }, [restaurantId])

  useEffect(() => {
    if (!restaurant || typeof window === 'undefined') return

    try {
      const raw = localStorage.getItem('visitHistory')
      const visits: Array<{
        id: string
        name: string
        address: string
        viewedAt: string
      }> = raw ? JSON.parse(raw) : []
      const filtered = visits.filter((item) => item.id !== restaurant.id)
      const updated = [
        {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.location.address,
          viewedAt: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, 50)

      localStorage.setItem('visitHistory', JSON.stringify(updated))
      window.dispatchEvent(new Event('visit-history-update'))
    } catch (error) {
      console.error('Failed to record visit history', error)
    }
  }, [restaurant])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Restaurant Not Found</h1>
        <Link href="/restaurants" className="text-orange-600 hover:underline">
          Back to Restaurants
        </Link>
      </div>
    )
  }

  const favorite = isFavorite(restaurant.id)

  const handleToggleFavorite = () => {
    toggleFavorite({ ...restaurant })
  }

  const handleReportReview = (reviewId: string) => {
    if (reportedReviewIds.includes(reviewId)) {
      alert('You have already reported this review. Thank you!')
      return
    }

    if (!rateLimiter.allow('report-review', 5, 60_000)) {
      alert('You are reporting reviews too quickly. Please wait a moment and try again.')
      return
    }

    const confirmed = window.confirm('Report this review as inappropriate?')
    if (!confirmed) return

    try {
      const updated = [...reportedReviewIds, reviewId]
      localStorage.setItem('reportedReviews', JSON.stringify(updated))
      window.dispatchEvent(new Event('reported-reviews-update'))
      setReportedReviewIds(updated)
      alert('Thank you. We will review this content shortly.')
    } catch (error) {
      console.error('Failed to update reported reviews', error)
    }
  }

  const priceRanges = [
    '$10-15',
    '$15-30',
    '$30-50',
    '$50+',
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/restaurants"
        className="inline-flex items-center text-gray-600 hover:text-orange-600 mb-6"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Restaurants
      </Link>

      {/* Restaurant Image Placeholder */}
      <div className="h-64 bg-gradient-to-br from-orange-200 to-red-200 rounded-lg mb-8 flex items-center justify-center">
        <span className="text-white text-3xl font-bold drop-shadow-lg text-center px-4">
          {restaurant.name}
        </span>
      </div>

      {/* Restaurant Info */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-yellow-500 text-2xl">★</span>
                <span className="text-gray-900 text-xl font-semibold ml-1">
                  {restaurant.averageRating}
                </span>
              </div>
              <span className="text-gray-500">({restaurant.reviewCount} reviews)</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg text-gray-700 mb-2">
              {priceRanges[restaurant.priceRange - 1]} per person
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                restaurant.isOpen
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {restaurant.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4">{restaurant.description}</p>

        {/* Location */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-start mb-4">
            <svg
              className="w-5 h-5 text-gray-500 mr-2 mt-1"
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
            <p className="text-gray-700">{restaurant.location.address}</p>
          </div>
        </div>

        {/* Map */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Location on Map</h3>
          <MapView
            initialLatitude={restaurant.location.latitude}
            initialLongitude={restaurant.location.longitude}
            initialZoom={15}
            markers={[
              {
                id: restaurant.id,
                name: restaurant.name,
                latitude: restaurant.location.latitude,
                longitude: restaurant.location.longitude,
                description: restaurant.description,
              } as RestaurantMarker,
            ]}
            height="400px"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <button
          onClick={() =>
            openNavigation(
              restaurant.location.latitude,
              restaurant.location.longitude,
              restaurant.name
            )
          }
          className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2"
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
          Get Directions
        </button>
        <button
          onClick={handleToggleFavorite}
          className={`flex-1 px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${
            favorite
              ? 'bg-gray-100 text-orange-600 border border-orange-200 hover:bg-orange-50'
              : 'bg-white text-orange-600 border border-orange-200 hover:bg-orange-50'
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
          {favorite ? 'Remove from Favorites' : 'Save to Favorites'}
        </button>
        <button className="flex-1 px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium">
          Write Review
        </button>
      </div>

      {/* Reviews Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Reviews</h2>
          {reviews.length > 0 && (
            <p className="text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, reviews.length)} of {reviews.length} reviews
            </p>
          )}
          {reviews.length === 0 && (
            <p className="text-gray-600">Page {currentPage} of {totalPages}</p>
          )}
        </div>
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedReviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                        <span className="text-orange-700 font-bold">
                          {review.userName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{review.userName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-gray-900 font-semibold">{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{review.comment}</p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{review.likes}</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReportReview(review.id)}
                      disabled={reportedReviewIds.includes(review.id)}
                      className={`text-sm ${
                        reportedReviewIds.includes(review.id)
                          ? 'text-red-400 cursor-not-allowed'
                          : 'text-red-500 hover:text-red-600'
                      }`}
                    >
                      {reportedReviewIds.includes(review.id) ? 'Reported' : 'Report'}
                    </button>
                    {reportedReviewIds.includes(review.id) && (
                      <span className="text-xs text-red-400">Pending review</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Always show pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

