import type { Restaurant } from '@/types'
import RestaurantCard from './RestaurantCard'
import Pagination from '@/components/common/Pagination'

interface RestaurantListProps {
  restaurants: (Restaurant & { distance?: number | null })[]
  isLoading?: boolean
  currentPage?: number
  onPageChange?: (page: number) => void
}

const ITEMS_PER_PAGE = 20

export default function RestaurantList({ 
  restaurants, 
  isLoading, 
  currentPage = 1,
  onPageChange 
}: RestaurantListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No restaurants found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters</p>
      </div>
    )
  }

  // Ensure at least 1 page, even if no restaurants
  const totalPages = Math.max(1, Math.ceil(restaurants.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedRestaurants = restaurants.slice(startIndex, endIndex)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
      {onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  )
}

