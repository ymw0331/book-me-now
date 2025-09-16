'use client'

import { useState, useRef } from 'react'
import { Button } from '@book-me-now/ui'
import { toast } from 'sonner'

interface ImageUploadProps {
  images: File[]
  currentImages: string[]
  onImagesChange: (images: File[]) => void
  onCurrentImagesChange: (images: string[]) => void
  showTips?: boolean
}

export default function ImageUpload({
  images,
  currentImages,
  onImagesChange,
  onCurrentImagesChange,
  showTips = false
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const validFiles: File[] = []
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported image format`)
        return
      }

      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 5MB)`)
        return
      }

      validFiles.push(file)
    })

    if (validFiles.length > 0) {
      const newImages = [...images, ...validFiles]
      if (newImages.length > 10) {
        toast.error('Maximum 10 images allowed')
        return
      }
      onImagesChange(newImages)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeImage = (index: number, isCurrentImage: boolean = false) => {
    if (isCurrentImage) {
      const newCurrentImages = [...currentImages]
      newCurrentImages.splice(index, 1)
      onCurrentImagesChange(newCurrentImages)
    } else {
      const newImages = [...images]
      newImages.splice(index, 1)
      onImagesChange(newImages)
    }
  }

  const moveImage = (fromIndex: number, toIndex: number, isCurrentImage: boolean = false) => {
    if (isCurrentImage) {
      const newCurrentImages = [...currentImages]
      const [movedImage] = newCurrentImages.splice(fromIndex, 1)
      newCurrentImages.splice(toIndex, 0, movedImage)
      onCurrentImagesChange(newCurrentImages)
    } else {
      const newImages = [...images]
      const [movedImage] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, movedImage)
      onImagesChange(newImages)
    }
  }

  const totalImages = currentImages.length + images.length

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="text-6xl text-gray-400">📸</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {totalImages === 0 ? 'Add your first photo' : 'Add more photos'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your images here, or click to browse
            </p>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              Choose files
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            <p>• JPEG, PNG, or WebP format</p>
            <p>• Maximum 5MB per image</p>
            <p>• Up to 10 images total</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      {showTips && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">📸 Photo tips for better bookings</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Start with a wide shot of your most impressive space</li>
            <li>• Include photos of each bedroom and bathroom</li>
            <li>• Show your kitchen and living areas</li>
            <li>• Capture unique features or views</li>
            <li>• Use natural light when possible</li>
            <li>• Make sure spaces are clean and clutter-free</li>
          </ul>
        </div>
      )}

      {/* Current Images Grid */}
      {currentImages.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Current Images ({currentImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {currentImages.map((image, index) => (
              <div key={`current-${index}`} className="relative group">
                <img
                  src={image}
                  alt={`Current ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />

                {/* Image Controls */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    {index > 0 && (
                      <button
                        onClick={() => moveImage(index, index - 1, true)}
                        className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 transition-all"
                        title="Move left"
                      >
                        ←
                      </button>
                    )}
                    <button
                      onClick={() => removeImage(index, true)}
                      className="bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-white transition-all"
                      title="Remove image"
                    >
                      ✕
                    </button>
                    {index < currentImages.length - 1 && (
                      <button
                        onClick={() => moveImage(index, index + 1, true)}
                        className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 transition-all"
                        title="Move right"
                      >
                        →
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Photo Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Main photo
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Images Grid */}
      {images.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            New Images ({images.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />

                {/* Image Controls */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    {index > 0 && (
                      <button
                        onClick={() => moveImage(index, index - 1)}
                        className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 transition-all"
                        title="Move left"
                      >
                        ←
                      </button>
                    )}
                    <button
                      onClick={() => removeImage(index)}
                      className="bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-white transition-all"
                      title="Remove image"
                    >
                      ✕
                    </button>
                    {index < images.length - 1 && (
                      <button
                        onClick={() => moveImage(index, index + 1)}
                        className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 transition-all"
                        title="Move right"
                      >
                        →
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Photo Badge */}
                {index === 0 && currentImages.length === 0 && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    New main photo
                  </div>
                )}

                {/* File Info */}
                <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {image.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Counter */}
      {totalImages > 0 && (
        <div className="text-center text-sm text-gray-600">
          {totalImages} of 10 images uploaded
          {totalImages >= 5 && <span className="text-green-600 ml-2">✓ Good variety</span>}
        </div>
      )}
    </div>
  )
}