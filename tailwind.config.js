/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.{html,js,hbs}"],
    theme: {
      extend: {
        colors: {
          primary: '#FFB800',
          'primary-hover': '#E5A600'
        }
      },
    },
    plugins: [],
  }