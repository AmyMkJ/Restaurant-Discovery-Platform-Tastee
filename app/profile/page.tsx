'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import RestaurantCard from '@/components/restaurant/RestaurantCard'
import { useFavorites } from '@/lib/context/FavoritesContext'

interface VisitHistoryItem {
  id: string
  name: string
  address: string
  viewedAt: string
}

interface UserInfo {
  name: string
  email?: string
}

export default function ProfilePage() {
  const { favorites, clearFavorites } = useFavorites()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [visitHistory, setVisitHistory] = useState<VisitHistoryItem[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadUser = () => {
      try {
        const raw = localStorage.getItem('user')
        if (!raw) {
          setUser(null)
          return
        }
        const parsed = JSON.parse(raw)
        if (parsed?.loggedIn) {
          setUser({ name: parsed.name || 'User', email: parsed.email })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Failed to load user info', error)
      }
    }

    const loadHistory = () => {
      try {
        const raw = localStorage.getItem('visitHistory')
        if (!raw) {
          setVisitHistory([])
          return
        }
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setVisitHistory(parsed)
        }
      } catch (error) {
        console.error('Failed to load visit history', error)
      }
    }

    loadUser()
    loadHistory()

    const handleStorageChange = () => {
      loadUser()
      loadHistory()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('visit-history-update', loadHistory)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('visit-history-update', loadHistory)
    }
  }, [])

  const clearVisitHistory = () => {
    if (typeof window === 'undefined') return
    if (!visitHistory.length) return
    const confirmed = window.confirm('Clear your visit history?')
    if (!confirmed) return
    localStorage.removeItem('visitHistory')
    setVisitHistory([])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600 mt-1">Manage your favorite restaurants and keep track of places you love.</p>
        </div>
        <Link
          href="/restaurants"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Restaurants
        </Link>
      </div>

      <section className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Overview</h2>
        {user ? (
          <div className="space-y-2 text-gray-700">
            <p><span className="font-medium">Name:</span> {user.name}</p>
            {user.email && <p><span className="font-medium">Email:</span> {user.email}</p>}
          </div>
        ) : (
          <p className="text-gray-600">You are browsing as a guest. Sign in to sync your history and favorites.</p>
        )}
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Favorite Restaurants</h2>
          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="text-sm text-gray-500 hover:text-orange-600"
            >
              Clear all favorites
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-600">
            <p>You have not saved any favorite restaurants yet.</p>
            <p className="mt-2 text-sm">Use the heart icon on any restaurant to add it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Recently Viewed</h2>
          {visitHistory.length > 0 && (
            <button
              onClick={clearVisitHistory}
              className="text-sm text-gray-500 hover:text-orange-600"
            >
              Clear history
            </button>
          )}
        </div>
        {visitHistory.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600">
            <p>No visit history yet. Explore restaurants to see them here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y">
            {visitHistory.map((item) => (
              <Link
                key={item.id}
                href={`/restaurants/${item.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.address}</p>
                </div>
                <p className="text-xs text-gray-400">
                  Viewed {new Date(item.viewedAt).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
