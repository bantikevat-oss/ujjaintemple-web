/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Locked palette — NO GREEN per HARD global rule
        saffron: {
          DEFAULT: '#D4621A',
          50: '#FDF4EC',
          100: '#FAE5CC',
          500: '#D4621A',
          600: '#B8501A',
          700: '#9C411B',
        },
        maroon: {
          DEFAULT: '#8B1A1A',
          50: '#FAEEEE',
          100: '#F5D7D7',
          500: '#8B1A1A',
          600: '#761515',
          700: '#5E1010',
          800: '#480C0C',
          900: '#2F0707',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E0C374',
          50: '#FBF7EC',
          100: '#F5EBC9',
          500: '#C9A84C',
          600: '#A48838',
          700: '#7E682A',
        },
        cream: {
          DEFAULT: '#FBF5EC',
          dark: '#F0E6D3',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          soft: '#3A3A3A',
          mute: '#6B6B6B',
        },
        // Status colors — DEEP BLUE (never green)
        statusOpen: '#1A56A0',
        statusClose: '#8B1A1A',
        link: '#1A56A0',
      },
      fontFamily: {
        sans: ['"DM Sans"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', '"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', '"Tiro Devanagari Sanskrit"', 'Georgia', 'serif'],
        sanskrit: ['"Tiro Devanagari Sanskrit"', '"Cormorant Garamond"', 'serif'],
      },
      maxWidth: {
        '7xl': '80rem',
        prose: '70ch',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
