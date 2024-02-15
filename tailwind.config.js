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
        Music: '#58508d',
        Exhibition: '#8a508f',
        Theater: '#bc5090',
        Dance: '#de5a79',
        Cinema: '#ff6361',
        Kids: '#ff8531',
        Sports: '#ffa600',
        Workshop: '#003f5c',
        bleuC: "#00b6e4ff",
        jauneor: "#ffc107",
        bleuF: "#181d3bff",

      },
    },
  },
  plugins: [],
}
