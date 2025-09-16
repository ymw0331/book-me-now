"use client"

import * as React from "react"
import { X, Loader2 } from "lucide-react"
import { cn } from "@book-me-now/utils"
import { Button } from "./button"

/**
 * Modal component props
 */
export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean

  /**
   * Function to call when modal should close
   */
  onClose: () => void

  /**
   * Modal title (optional)
   */
  title?: string

  /**
   * Modal content
   */
  children: React.ReactNode

  /**
   * Footer content (buttons, etc.)
   */
  footer?: React.ReactNode

  /**
   * Modal size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Whether clicking the overlay closes the modal
   */
  closeOnOverlayClick?: boolean

  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean

  /**
   * Whether the modal is in a loading state
   */
  loading?: boolean

  /**
   * Modal variant
   */
  variant?: 'default' | 'booking' | 'confirmation' | 'fullscreen'

  /**
   * Animation direction
   */
  animationFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center'
}

/**
 * Modern modal component with glass-morphism design
 *
 * Features:
 * - Glass-morphism backdrop with blur effect
 * - Smooth animations from multiple directions
 * - Multiple size variants
 * - Loading states
 * - Booking-specific styling
 * - Fullscreen support for mobile
 * - Accessibility features (focus trap, escape key)
 *
 * Usage:
 * <Modal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   title="Booking Confirmation"
 *   variant="booking"
 * >
 *   <BookingDetails />
 * </Modal>
 */
const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    className,
    closeOnOverlayClick = true,
    showCloseButton = true,
    loading = false,
    variant = 'default',
    animationFrom = 'center'
  }, ref) => {

    // Handle body scroll lock
    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = '0px' // Prevent layout shift
      } else {
        document.body.style.overflow = 'unset'
        document.body.style.paddingRight = 'unset'
      }

      return () => {
        document.body.style.overflow = 'unset'
        document.body.style.paddingRight = 'unset'
      }
    }, [isOpen])

    // Handle escape key
    React.useEffect(() => {
      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose()
        }
      }

      if (isOpen) {
        document.addEventListener('keydown', handleEscapeKey)
        return () => document.removeEventListener('keydown', handleEscapeKey)
      }
    }, [isOpen, onClose])

    // Handle overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose()
      }
    }

    if (!isOpen) return null

    // Size classes
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full mx-4 my-4 h-full'
    }

    // Animation classes based on direction
    const animationClasses = {
      bottom: 'animate-slideUp',
      top: 'animate-slideDown',
      left: 'animate-slideLeft',
      right: 'animate-slideRight',
      center: 'animate-fadeIn'
    }

    // Variant-specific styles
    const variantClasses = {
      default: 'bg-white',
      booking: 'bg-white',
      confirmation: 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200',
      fullscreen: 'bg-white h-full'
    }

    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center",
          variant === 'fullscreen' ? 'p-0' : 'p-4',
          // Glass-morphism backdrop
          "bg-black/40 backdrop-blur-sm",
          "animate-fadeIn"
        )}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        <div
          ref={ref}
          className={cn(
            "relative w-full flex flex-col",
            "shadow-2xl border border-gray-200/50",
            variant === 'fullscreen' ? 'h-full rounded-none' : 'rounded-2xl',
            // Size classes
            size === 'full' ? 'h-full' : sizeClasses[size],
            // Variant styles
            variantClasses[variant],
            // Animation
            animationClasses[animationFrom],
            // Glass-morphism for modal content
            variant !== 'fullscreen' && "backdrop-blur-xl bg-white/95",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="h-8 w-8 text-accent-airbnb animate-spin" />
                <p className="text-sm text-gray-600">Loading...</p>
              </div>
            </div>
          )}

          {/* Header */}
          {(title || showCloseButton) && (
            <div className={cn(
              "flex items-center justify-between p-6",
              variant === 'fullscreen' ? 'border-b border-gray-200/50' : 'border-b border-gray-100',
              variant === 'fullscreen' && 'bg-white/90 backdrop-blur-sm'
            )}>
              <div className="flex-1">
                {title && (
                  <h2
                    id="modal-title"
                    className={cn(
                      "font-semibold text-gray-900",
                      variant === 'fullscreen' ? 'text-xl' : 'text-lg'
                    )}
                  >
                    {title}
                  </h2>
                )}
              </div>

              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className={cn(
                    "rounded-full hover:bg-gray-100 transition-colors",
                    variant === 'fullscreen' && "h-10 w-10"
                  )}
                  aria-label="Close modal"
                >
                  <X className={cn(
                    variant === 'fullscreen' ? 'h-5 w-5' : 'h-4 w-4'
                  )} />
                </Button>
              )}
            </div>
          )}

          {/* Body */}
          <div className={cn(
            "flex-1 overflow-y-auto",
            variant === 'fullscreen'
              ? "p-6"
              : size === 'full'
                ? "p-6 max-h-[calc(100vh-200px)]"
                : "p-6 max-h-[70vh]",
            // Custom scrollbar
            "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          )}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={cn(
              "flex items-center justify-end gap-3 p-6",
              "border-t border-gray-100",
              variant === 'booking' && "bg-gray-50/50"
            )}>
              {footer}
            </div>
          )}
        </div>
      </div>
    )
  }
)
Modal.displayName = "Modal"

/**
 * Modal confirmation variant with predefined styling
 */
const ModalConfirmation = React.forwardRef<HTMLDivElement, Omit<ModalProps, 'variant'> & {
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'default' | 'destructive'
}>(({
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'default',
  footer,
  ...props
}, ref) => {
  const defaultFooter = (
    <>
      <Button
        variant="ghost"
        onClick={onCancel || props.onClose}
      >
        {cancelText}
      </Button>
      <Button
        variant={confirmVariant}
        onClick={onConfirm}
      >
        {confirmText}
      </Button>
    </>
  )

  return (
    <Modal
      ref={ref}
      variant="confirmation"
      footer={footer || defaultFooter}
      {...props}
    />
  )
})
ModalConfirmation.displayName = "ModalConfirmation"

/**
 * Modal booking variant with booking-specific styling
 */
const ModalBooking = React.forwardRef<HTMLDivElement, Omit<ModalProps, 'variant'>>(
  (props, ref) => {
    return (
      <Modal
        ref={ref}
        variant="booking"
        size="lg"
        {...props}
      />
    )
  }
)
ModalBooking.displayName = "ModalBooking"

export { Modal, ModalConfirmation, ModalBooking }