export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    "./node_modules/flowbite/**/*.js",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {},
  },
  darkMode: 'media',
  plugins: [
    require('flowbite/plugin')
  ]
}