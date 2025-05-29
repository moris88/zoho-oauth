/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite-react/tailwind'

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
    flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite.plugin(),
  ],
}

