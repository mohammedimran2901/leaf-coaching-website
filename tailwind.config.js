/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm editorial palette
        forest: {
          DEFAULT: '#1F3D2B',
          deep: '#142819',
          soft: '#3A5C45',
        },
        clay: {
          DEFAULT: '#C4744A',
          light: '#E09B72',
          pale: '#F3DFD2',
        },
        sand: {
          DEFAULT: '#F6F1E7',
          deep: '#EDE5D6',
          darker: '#E2D7C3',
        },
        ink: {
          DEFAULT: '#2B2622',
          soft: '#5C554D',
          muted: '#8A8178',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}