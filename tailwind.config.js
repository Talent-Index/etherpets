/** @type {import('tailwindcss').Types.Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A192F',
          50: '#0f274a',
          100: '#133163',
        },
        accent: {
          cyan: '#00FFFF',
          lavender: '#C9A0DC',
          mint: '#6FFFE9',
          teal: '#5BC0BE',
        },
        mood: {
          happy: '#FFD700',
          neutral: '#9CA3AF',
          sad: '#3B82F6',
          excited: '#F87171',
          calm: '#10B981'
        }
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
        'display': ['Press Start 2P', 'monospace']
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}