/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-mode="dark"]'],
  content: ['./index.html', './src/components/**/*.{ts,tsx}'],
  presets: [require('./src/styles/theme-preset.js')],
};
