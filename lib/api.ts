import type {
  Restaurant,
  Review,
  SearchFilters,
  ApiResponse,
  PaginatedResponse,
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

// Restaurant API calls
export async function getRestaurants(
  filters?: SearchFilters,
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<PaginatedResponse<Restaurant>>> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (filters?.query) queryParams.append('query', filters.query)
  if (filters?.tags?.length) queryParams.append('tags', filters.tags.join(','))
  if (filters?.priceRange?.length) {
    queryParams.append('priceRange', filters.priceRange.join(','))
  }
  if (filters?.maxDistance) {
    queryParams.append('maxDistance', filters.maxDistance.toString())
  }
  if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy)
  if (filters?.isOpen !== undefined) {
    queryParams.append('isOpen', filters.isOpen.toString())
  }

  return fetchAPI<PaginatedResponse<Restaurant>>(`/restaurants?${queryParams}`)
}

export async function getRestaurantById(
  id: string
): Promise<ApiResponse<Restaurant>> {
  return fetchAPI<Restaurant>(`/restaurants/${id}`)
}

// Review API calls
export async function getRestaurantReviews(
  restaurantId: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PaginatedResponse<Review>>> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  return fetchAPI<PaginatedResponse<Review>>(
    `/restaurants/${restaurantId}/reviews?${queryParams}`
  )
}

