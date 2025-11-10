// Restaurant types
export interface Restaurant {
  id: string
  name: string
  description?: string
  location: {
    address: string
    latitude: number
    longitude: number
  }
  tags: string[]
  priceRange: 1 | 2 | 3 | 4 // $ to $$$$
  averageRating: number
  reviewCount: number
  images?: string[]
  openingHours?: {
    [key: string]: {
      open: string
      close: string
    }
  }
  isOpen?: boolean
}

// Review types
export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  restaurantId: string
  rating: number
  comment: string
  images?: string[]
  createdAt: string
  likes: number
  likedByUser: boolean
}

// Search filters
export interface SearchFilters {
  query?: string
  tags?: string[]
  priceRange?: number[]
  maxDistance?: number // in km
  sortBy?: 'newest' | 'popularity' | 'price' | 'distance'
  isOpen?: boolean
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}


