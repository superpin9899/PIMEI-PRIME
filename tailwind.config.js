/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#5d0008',
        'brand-soft': '#8a1a22',
        'brand-fade': '#fbe3e5',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'],
        heading: ['"Inter Variable"', 'system-ui', 'sans-serif'],
      },
      dropShadow: {
        glow: '0 20px 35px rgba(93, 0, 8, 0.45)',
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(120deg, rgba(93,0,8,0.15) 0%, rgba(18,18,24,0.9) 60%), radial-gradient(circle at 20% 20%, rgba(250,250,250,0.08), transparent 45%)',
      },
    },
  },
  plugins: [],
};

