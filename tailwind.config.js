export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}',  "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
  },
  darkMode: 'media',
  plugins: [
    require('flowbite/plugin')
  ]
}