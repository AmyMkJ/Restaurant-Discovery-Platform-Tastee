'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Restaurant } from '@/types'
import { rateLimiter } from '@/lib/utils/rateLimiter'

interface FavoritesContextValue {
  favorites: Restaurant[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (restaurant: Restaurant) => void
  removeFavorite: (id: string) => void
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

const STORAGE_KEY = 'favoriteRestaurants'

function readFavoritesFromStorage(): Restaurant[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored) as Restaurant[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch (error) {
    console.error('Failed to parse favorites from storage', error)
    return []
  }
}

function writeFavoritesToStorage(favorites: Restaurant[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    window.dispatchEvent(new Event('favorites-update'))
  } catch (error) {
    console.error('Failed to write favorites to storage', error)
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Restaurant[]>([])

  useEffect(() => {
    setFavorites(readFavoritesFromStorage())

    const handleStorageChange = () => {
      setFavorites(readFavoritesFromStorage())
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('favorites-update', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('favorites-update', handleStorageChange)
    }
  }, [])

  const isFavorite = useCallback(
    (id: string) => favorites.some((restaurant) => restaurant.id === id),
    [favorites]
  )

  const toggleFavorite = useCallback(
    (restaurant: Restaurant) => {
      if (!rateLimiter.allow('favorite-toggle', 10, 60_000)) {
        alert('You are toggling favorites too quickly. Please wait a moment and try again.')
        return
      }

      setFavorites((prev) => {
        const exists = prev.some((item) => item.id === restaurant.id)
        const updated = exists ? prev.filter((item) => item.id !== restaurant.id) : [...prev, restaurant]
        writeFavoritesToStorage(updated)
        return updated
      })
    },
    []
  )

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      writeFavoritesToStorage(updated)
      return updated
    })
  }, [])

  const clearFavorites = useCallback(() => {
    setFavorites([])
    writeFavoritesToStorage([])
  }, [])

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites }),
    [favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites]
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
