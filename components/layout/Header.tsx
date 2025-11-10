'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [businessUser, setBusinessUser] = useState<any>(null)
  const [regularUser, setRegularUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const businessStr = localStorage.getItem('businessUser')
    const userStr = localStorage.getItem('user')
    
    if (businessStr) {
      setBusinessUser(JSON.parse(businessStr))
    }
    if (userStr) {
      const user = JSON.parse(userStr)
      if (user.loggedIn && !user.isBusiness) {
        setRegularUser(user)
      }
    }

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      const businessStr = localStorage.getItem('businessUser')
      const userStr = localStorage.getItem('user')
      setBusinessUser(businessStr ? JSON.parse(businessStr) : null)
      if (userStr) {
        const user = JSON.parse(userStr)
        setRegularUser(user.loggedIn && !user.isBusiness ? user : null)
      } else {
        setRegularUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-orange-600">Tastee</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/restaurants"
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Restaurants
            </Link>
            <Link
              href="/map-demo"
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Map
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {businessUser ? (
              <>
                <Link
                  href="/business/dashboard"
                  className="text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Business Dashboard
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('businessUser')
                    setBusinessUser(null)
                    window.location.href = '/'
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : regularUser ? (
              <>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Hi, {regularUser.name}!
                </Link>
                <button
                  onClick={() => {
                    const user = { ...regularUser, loggedIn: false }
                    localStorage.setItem('user', JSON.stringify(user))
                    setRegularUser(null)
                    window.location.href = '/'
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  href="/business/login"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Business
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <Link
                href="/restaurants"
                className="text-gray-700 hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Restaurants
              </Link>
              <Link
                href="/map-demo"
                className="text-gray-700 hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Map
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="pt-2 border-t flex flex-col gap-2">
                {businessUser ? (
                  <>
                    <Link
                      href="/business/dashboard"
                      className="text-left text-gray-700 hover:text-orange-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Business Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem('businessUser')
                        setBusinessUser(null)
                        setIsMenuOpen(false)
                        window.location.href = '/'
                      }}
                      className="text-left px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : regularUser ? (
                  <>
                    <Link
                      href="/profile"
                      className="text-left text-gray-700 hover:text-orange-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Hi, {regularUser.name}!
                    </Link>
                    <button
                      onClick={() => {
                        const user = { ...regularUser, loggedIn: false }
                        localStorage.setItem('user', JSON.stringify(user))
                        setRegularUser(null)
                        setIsMenuOpen(false)
                        window.location.href = '/'
                      }}
                      className="text-left px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-left text-gray-700 hover:text-orange-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="text-left px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/business/login"
                      className="text-left text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Business Login
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

