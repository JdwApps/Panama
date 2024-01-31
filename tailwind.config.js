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
        jaune: '#d3c858ff', 
        anis: '#78b23aff', 
        foret: '#2f9543ff', 
        turquoise: '#278d6cff', 
        bleu: '#3779a6ff', 
        marine: '#4654c8ff', 
        violet: '#7c39bfff', 
        rose: '#b64481ff', 
        rouge: '#ae343eff', 
        sanguine: '#c0733dff', 
        orange: '#bc8438ff', 
        bleuC:"#00b6e4ff",
        jauneor:"#ffc107",
        bleuF:"#181d3bff",
        
      },
    },
  },
  plugins: [],
}
