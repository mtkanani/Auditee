/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // slate, brand and the semantic colours are theme tokens in src/index.css
      // so they can switch between dark and light.
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass-sm': '0 2px 8px 0 rgba(0, 0, 0, 0.3)',
        'glass-md': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-lg': '0 12px 40px 0 rgba(0, 0, 0, 0.45)',
        'glow-indigo': '0 0 20px 2px rgba(99, 102, 241, 0.25)',
        'glow-violet': '0 0 20px 2px rgba(139, 92, 246, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
