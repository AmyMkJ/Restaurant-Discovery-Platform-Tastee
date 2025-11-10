'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Restaurant } from '@/types'

export default function BusinessDashboardPage() {
  const router = useRouter()
  const [businessUser, setBusinessUser] = useState<any>(null)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Restaurant>>({})

  useEffect(() => {
    // Check if user is logged in as business
    const userStr = localStorage.getItem('businessUser')
    if (!userStr) {
      router.push('/business/login')
      return
    }

    const user = JSON.parse(userStr)
    setBusinessUser(user)

    // In a real app, fetch restaurant data from API
    // For now, we'll use mock data or create new
    const savedRestaurant = localStorage.getItem(`restaurant_${user.email}`)
    if (savedRestaurant) {
      const restaurantData = JSON.parse(savedRestaurant)
      setRestaurant(restaurantData)
      setFormData(restaurantData)
    } else {
      // Initialize with default values
      const defaultData: Partial<Restaurant> = {
        name: user.restaurantName || 'My Restaurant',
        description: '',
        location: {
          address: '',
          latitude: 43.6532,
          longitude: -79.3832,
        },
        tags: [],
        priceRange: 2,
        averageRating: 0,
        reviewCount: 0,
        isOpen: true,
        images: [],
      }
      setFormData(defaultData)
      setIsEditing(true)
    }
  }, [router])

  const handleSave = () => {
    if (!businessUser || !formData.name || !formData.location?.address) {
      alert('Please fill in at least name and address')
      return
    }

    const restaurantData: Restaurant = {
      id: restaurant?.id || Date.now().toString(),
      name: formData.name!,
      description: formData.description || '',
      location: formData.location!,
      tags: formData.tags || [],
      priceRange: (formData.priceRange as 1 | 2 | 3 | 4) || 2,
      averageRating: formData.averageRating || 0,
      reviewCount: formData.reviewCount || 0,
      isOpen: formData.isOpen ?? true,
      images: formData.images || [],
    }

    // Save to localStorage (in real app, save to backend)
    localStorage.setItem(`restaurant_${businessUser.email}`, JSON.stringify(restaurantData))
    setRestaurant(restaurantData)
    setIsEditing(false)
    alert('Restaurant information saved!')
  }

  const handleLogout = () => {
    localStorage.removeItem('businessUser')
    router.push('/')
  }

  if (!businessUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Dashboard</h1>
          <p className="text-gray-600">Manage your restaurant information</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/restaurants"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View as Customer
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isEditing ? 'Edit Restaurant Information' : 'Restaurant Information'}
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                rows={4}
                placeholder="Describe your restaurant..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                value={formData.location?.address || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location!, address: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="123 Main St, Toronto, ON"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.location?.latitude || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location!,
                        latitude: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="43.6532"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.location?.longitude || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location!,
                        longitude: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="-79.3832"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={(formData.tags || []).join(', ')}
                onChange={(e) => {
                  const tags = e.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0)
                  setFormData({ ...formData, tags })
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Italian, Pizza, Fine Dining"
              />
              <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={formData.priceRange || 2}
                onChange={(e) =>
                  setFormData({ ...formData, priceRange: parseInt(e.target.value) as 1 | 2 | 3 | 4 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value={1}>$10-15 per person</option>
                <option value={2}>$15-30 per person</option>
                <option value={3}>$30-50 per person</option>
                <option value={4}>$50+ per person</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isOpen"
                checked={formData.isOpen ?? true}
                onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <label htmlFor="isOpen" className="ml-2 text-sm font-medium text-gray-700">
                Restaurant is currently open
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setFormData(restaurant || {})
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Name</span>
              <p className="text-lg text-gray-900">{restaurant?.name || 'Not set'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Description</span>
              <p className="text-gray-700">{restaurant?.description || 'No description'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Address</span>
              <p className="text-gray-700">{restaurant?.location?.address || 'Not set'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Tags</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {(restaurant?.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Price Range</span>
              <p className="text-gray-700">
                {['$10-15', '$15-30', '$30-50', '$50+'][(restaurant?.priceRange || 2) - 1]} per person
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Status</span>
              <p className="text-gray-700">
                {restaurant?.isOpen ? (
                  <span className="text-green-600">Open</span>
                ) : (
                  <span className="text-red-600">Closed</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Tips</h3>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li>• Get coordinates from Google Maps (right-click on your location → coordinates)</li>
          <li>• Update your information regularly to keep customers informed</li>
          <li>• Use descriptive tags to help customers find your restaurant</li>
        </ul>
      </div>
    </div>
  )
}


