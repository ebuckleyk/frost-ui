const themePreset = require('./src/styles/theme-preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [themePreset],
  content: ['./src/**/*.{js,ts,jsx,tsx}', './src/styles/frostui.css'],
  darkMode: 'class',
};
