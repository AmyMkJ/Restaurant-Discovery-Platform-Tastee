'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BusinessLoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    restaurantName: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isLogin) {
      // Login logic
      if (formData.email && formData.password) {
        // Store business user info in localStorage
        localStorage.setItem('businessUser', JSON.stringify({
          email: formData.email,
          isBusiness: true,
        }))
        router.push('/business/dashboard')
      } else {
        setError('Please fill in all fields')
      }
    } else {
      // Register logic
      if (formData.email && formData.password && formData.businessName && formData.restaurantName) {
        // Store business user info
        localStorage.setItem('businessUser', JSON.stringify({
          email: formData.email,
          businessName: formData.businessName,
          restaurantName: formData.restaurantName,
          isBusiness: true,
        }))
        router.push('/business/dashboard')
      } else {
        setError('Please fill in all fields')
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Business Login' : 'Register Your Restaurant'}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? 'Sign in to manage your restaurant'
              : 'Create an account to manage your restaurant information'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Owner Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  id="restaurantName"
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="My Restaurant"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="business@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign in'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-600 hover:text-gray-800 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}


