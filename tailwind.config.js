/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FBF6EE',
        ink: '#3A2E27',
        sub: '#8A7A6E',
        line: '#EFE3D4',
        coral: {
          light: '#FBEFE7',
          DEFAULT: '#F4795B',
          dark: '#E15C3D',
        },
        teal: {
          light: '#EAF4F4',
          DEFAULT: '#2E8B8B',
          dark: '#245F5F',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
