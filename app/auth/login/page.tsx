'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (formData.email && formData.password) {
        // Store user info in localStorage
        const userData = {
          email: formData.email,
          name: formData.email.split('@')[0], // Simple name from email
          isBusiness: false,
          loggedIn: true,
        }
        localStorage.setItem('user', JSON.stringify(userData))
        router.push('/restaurants')
      } else {
        setError('Please fill in all fields')
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="your@email.com"
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

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link href="/auth/forgot-password" className="text-sm text-orange-600 hover:text-orange-700">
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-orange-600 hover:text-orange-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Business owner?{' '}
            <Link href="/business/login" className="text-orange-600 hover:text-orange-700 font-medium">
              Business Login
            </Link>
          </p>
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


