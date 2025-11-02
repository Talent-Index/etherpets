/** @type {import('tailwindcss').Types.Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary color palette for the application
        primary: {
          DEFAULT: '#0A192F', // Deep navy blue - main background
          50: '#0f274a',      // Lighter navy
          100: '#133163',     // Even lighter navy
        },
        // Accent colors for interactive elements
        accent: {
          cyan: '#00FFFF',    // Bright cyan for highlights
          lavender: '#C9A0DC', // Soft lavender for secondary elements
          mint: '#6FFFE9',    // Mint green for success states
          teal: '#5BC0BE',    // Teal for primary buttons
        },
        // Mood-based colors for pet emotions
        mood: {
          happy: '#FFD700',   // Gold for happiness
          neutral: '#9CA3AF', // Gray for neutral
          sad: '#3B82F6',     // Blue for sadness
          excited: '#F87171', // Coral red for excitement
          calm: '#10B981'     // Green for calm
        }
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],     // Main UI font
        'display': ['Press Start 2P', 'monospace'] // Retro font for headers
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' }
        }
      }
    },
  },
  plugins: [],
}