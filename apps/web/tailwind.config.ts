import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // CSS Variable based colors
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Complete primary palette (blue for main brand)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },

        // Booking platform accent colors
        accent: {
          airbnb: '#FF385C',      // Airbnb red for CTAs, favorites
          'airbnb-dark': '#E61E4D',
          booking: '#003580',     // Booking.com blue
          'booking-light': '#0050a0',
          teal: '#00A699',        // Success states
          'teal-light': '#00d4aa',
          gold: '#FFB400',        // Ratings, premium
          'gold-light': '#FFC933',
        },

        // Semantic colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },

        // Extended gray scale for UI elements
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },

      // Custom spacing for consistent layouts
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },

      // Typography scale
      fontSize: {
        'display-lg': ['5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-xs': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },

      // Font family
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'display': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },

      // Box shadows for depth
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'sticky': '0 1px 0 rgba(0, 0, 0, 0.1)',
        'popup': '0 16px 32px rgba(0, 0, 0, 0.12)',
        'dropdown': '0 10px 40px rgba(0, 0, 0, 0.15)',
        'modal': '0 20px 60px rgba(0, 0, 0, 0.2)',
      },

      // Border radius
      borderRadius: {
        'card': '1rem',
        'button': '0.625rem',
        'input': '0.5rem',
      },

      // Animations
      animation: {
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spin-slow': 'spin 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },

      // Keyframes
      keyframes: {
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        fadeOut: {
          'from': { opacity: '1' },
          'to': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          'to': { transform: 'translateX(100%)' },
        },
      },

      // Transitions
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },

      // Backdrop filters
      backdropBlur: {
        'xs': '2px',
      },

      // Z-index scale
      zIndex: {
        'dropdown': '100',
        'sticky': '200',
        'modal': '300',
        'popover': '400',
        'tooltip': '500',
      },
    },
  },
  plugins: [],
};

export default config;