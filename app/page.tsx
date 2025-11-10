import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-orange-600 mb-4">Tastee</h1>
        <p className="text-xl text-gray-700 mb-8">Restaurant Discovery Platform</p>
        <p className="text-gray-600 mb-12">Discover amazing restaurants near you</p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/restaurants"
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Browse Restaurants
        </Link>
        <Link
          href="/map-demo"
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          View Map
        </Link>
      </div>
    </div>
  )
}
