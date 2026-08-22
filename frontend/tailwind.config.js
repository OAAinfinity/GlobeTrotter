/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF8F1',
          100: '#FFEEDD',
          200: '#FDDCA9',
          300: '#FBBF71',
          400: '#F79638',
          500: '#F59E0B', // Primary Warm Amber
          600: '#EA580C', // Sunset Orange Accent
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        ocean: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6',
          600: '#0D9488', // Ocean Teal
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        sand: {
          50: '#FAF9F6',
          100: '#F4F1EA',
          200: '#E8E2D5',
          300: '#D5CAA8',
          800: '#4A4338',
          900: '#2C2720',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(245, 158, 11, 0.12), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'warm-md': '0 8px 24px -4px rgba(245, 158, 11, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'warm-lg': '0 16px 36px -6px rgba(234, 88, 12, 0.15), 0 8px 20px -4px rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
