'use client'

interface PropertyMapProps {
  coordinates?: {
    lat: number
    lng: number
  }
  address: string
}

export default function PropertyMap({ coordinates, address }: PropertyMapProps) {
  // This is a placeholder component for the map
  // In a real application, you would integrate with Google Maps, MapBox, or another mapping service

  const handleOpenInMaps = () => {
    if (coordinates) {
      const url = `https://maps.google.com?q=${coordinates.lat},${coordinates.lng}`
      window.open(url, '_blank')
    } else {
      const url = `https://maps.google.com?q=${encodeURIComponent(address)}`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="space-y-4">
      {/* Map Placeholder */}
      <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden group cursor-pointer">
        <div
          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white relative overflow-hidden"
          onClick={handleOpenInMaps}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-white rounded-full"></div>

            {/* Street lines */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white opacity-30 transform -rotate-12"></div>
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white opacity-30 transform rotate-6"></div>
            <div className="absolute bottom-1/3 left-0 right-0 h-px bg-white opacity-30 transform -rotate-3"></div>
          </div>

          <div className="text-center z-10">
            <div className="text-4xl mb-2">📍</div>
            <h3 className="font-semibold text-lg mb-1">Property Location</h3>
            <p className="text-blue-100 text-sm mb-4 max-w-xs">
              Click to open in Google Maps
            </p>
            {coordinates && (
              <div className="text-xs text-blue-200 font-mono">
                {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </div>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        </div>
      </div>

      {/* Map Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          📍 Exact location shown after booking
        </div>
        <button
          onClick={handleOpenInMaps}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium underline underline-offset-2"
        >
          Open in maps →
        </button>
      </div>

      {/* Neighborhood Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">About the area</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <span>🏪 Grocery store</span>
            <span className="text-gray-500">5 min walk</span>
          </div>
          <div className="flex items-center justify-between">
            <span>🚇 Metro station</span>
            <span className="text-gray-500">8 min walk</span>
          </div>
          <div className="flex items-center justify-between">
            <span>🍕 Restaurants</span>
            <span className="text-gray-500">3 min walk</span>
          </div>
          <div className="flex items-center justify-between">
            <span>🏖️ Beach/Waterfront</span>
            <span className="text-gray-500">15 min walk</span>
          </div>
        </div>
      </div>

      {/* Getting Around */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Getting around</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start">
            <span className="mr-2">🚕</span>
            <div>
              <div className="font-medium">Taxi/Rideshare</div>
              <div className="text-gray-600">Easy to find rides in this area</div>
            </div>
          </div>
          <div className="flex items-start">
            <span className="mr-2">🚌</span>
            <div>
              <div className="font-medium">Public transport</div>
              <div className="text-gray-600">Well connected by bus and metro</div>
            </div>
          </div>
          <div className="flex items-start">
            <span className="mr-2">🚶</span>
            <div>
              <div className="font-medium">Walkable</div>
              <div className="text-gray-600">Most attractions within walking distance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}