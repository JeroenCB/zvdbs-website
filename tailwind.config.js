/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // De pagina- en nieuwsinhoud (contact, lidmaatschap, etc.) bevat ruwe HTML
    // met eigen Tailwind-classes. Zonder dit scant Tailwind die classes niet
    // en genereert het er stilletjes geen CSS voor.
    './public/data/**/*.json',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        sub: '#5B6B7C',
        line: '#E6EEF2',
        aqua: {
          light: '#F4FAFC',
          DEFAULT: '#0EA5E9',
          dark: '#06B6D4',
        },
        // Donker palet, gebaseerd op moodboard "5-dark-premium".
        night: {
          bg: '#0A0E1A',
          panel: '#0F1526',
          card: 'rgba(255,255,255,0.03)',
          ink: '#F1F5F9',
          sub: '#8B95AB',
          line: 'rgba(255,255,255,0.08)',
          cyan: '#22D3EE',
          violet: '#818CF8',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        sora: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
