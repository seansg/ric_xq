export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}',  "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    require('flowbite/plugin')
  ]
}