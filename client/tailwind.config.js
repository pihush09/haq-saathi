/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f6f3',
          100: '#dcece3',
          200: '#bcddcc',
          300: '#90c6ae',
          400: '#5ea88d',
          500: '#3c8c71',
          600: '#2b705a',
          700: '#225948',
          800: '#1c473b',
          900: '#183b31',
          950: '#0c221c',
        },
        cream: {
          50: '#fdfcf9',
          100: '#f9f6f0',
          200: '#f2ede1',
          300: '#e7dfcb',
          400: '#d8cbaf',
        },
        sage: {
          50: '#f5f7f5',
          100: '#e8ede8',
          200: '#d3ded3',
          300: '#b4c7b5',
          400: '#8faa92',
          500: '#719074',
        },
        accent: {
          lime: '#84cc16',
          limeHover: '#65a30d',
          limeLight: '#ecfccb',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Devanagari"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
