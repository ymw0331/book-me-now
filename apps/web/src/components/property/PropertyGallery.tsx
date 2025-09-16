'use client'

import { useState } from 'react'
import { Button } from '@book-me-now/ui'

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📸</div>
          <p>No images available</p>
        </div>
      </div>
    )
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setShowLightbox(true)
  }

  const closeLightbox = () => {
    setShowLightbox(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-lg overflow-hidden">
        {/* Main Image */}
        <div className="md:col-span-2 md:row-span-2">
          <div
            className="relative w-full h-64 md:h-96 cursor-pointer group overflow-hidden"
            onClick={() => openLightbox(0)}
          >
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                View Gallery
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Images */}
        {images.slice(1, 5).map((image, index) => (
          <div key={index + 1} className="relative">
            <div
              className="w-full h-32 md:h-48 cursor-pointer group overflow-hidden rounded-lg"
              onClick={() => openLightbox(index + 1)}
            >
              <img
                src={image}
                alt={`${title} ${index + 2}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />

              {/* Show more indicator on last visible image */}
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-lg font-semibold">
                    +{images.length - 5} more
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View All Photos Button */}
      {images.length > 1 && (
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => openLightbox(0)}
            className="w-full md:w-auto"
          >
            📸 View all {images.length} photos
          </Button>
        </div>
      )}

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">

            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all"
            >
              ✕
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Main Image */}
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={`${title} ${currentImageIndex + 1}`}
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-all"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-all"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-white'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Click outside to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={closeLightbox}
          />
        </div>
      )}
    </>
  )
}