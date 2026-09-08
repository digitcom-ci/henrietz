/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette Spéciale Maison HENRIETZ Client
        terracotta: '#8F3215', // Terre cuite profonde
        cacao: '#42170D',      // Brun cacao
        cognac: '#A85A2A',     // Bois cognac
        ivoire: '#F5E8D1',     // Ivoire
        sable: '#D6B58B',      // Sable
        charbon: '#211B18',    // Charbon
        henrietz: {
          dark: '#211B18',
          ebony: '#42170D',
          walnut: '#42170D',
          oak: '#A85A2A',
          warmWood: '#8F3215',
          sand: '#D6B58B',
          linen: '#F5E8D1',
          cream: '#F5E8D1',
          gold: '#D6B58B',
          brass: '#A85A2A',
          subtle: '#8F3215'
        }
      },
      fontFamily: {
        serif: ['Comfortaa', 'cursive', 'sans-serif'],
        comfortaa: ['Comfortaa', 'cursive', 'sans-serif'],
        sans: ['Montserrat', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.18em',
        ultra: '0.25em',
      },
      boxShadow: {
        'soft-wood': '0 20px 40px -15px rgba(43, 28, 20, 0.08)',
        'glow-gold': '0 0 25px rgba(200, 162, 97, 0.25)',
      }
    },
  },
  plugins: [],
}
