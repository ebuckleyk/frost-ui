React component library for ebuckleyk applications

### Demo

https://ebuckleyk.github.io/frost-ui/

### Installation (Vite + Tailwind v4)

1. Install package and Tailwind deps:
   - `npm i @ebuckleyk/frost-ui`
   - `npm i -D tailwindcss @tailwindcss/vite tw-animate-css`
2. Add Tailwind to Vite:
   - `vite.config.ts`:
     ```ts
     import { defineConfig } from 'vite';
     import react from '@vitejs/plugin-react';
     import tailwindcss from '@tailwindcss/vite';

     export default defineConfig({
       plugins: [react(), tailwindcss()],
     });
     ```
3. Use the Frost UI preset and scan package files:
   - `tailwind.config.js`:
     ```js
     module.exports = {
       presets: [require('@ebuckleyk/frost-ui/dist/presets/theme.js')],
       content: [
         './index.html',
         './src/**/*.{js,ts,jsx,tsx}',
         './node_modules/@ebuckleyk/frost-ui/dist/**/*.{js,ts,jsx,tsx}',
       ],
     };
     ```
4. Import the library CSS once:
   - `src/main.tsx`:
     ```ts
     import '@ebuckleyk/frost-ui/dist/styles/frostui.css';
     ```

### How to update library

1. Run `npm run lint` _Safety check to prevent publish from failing_
2. Run `npx changeset`
3. Select `major|minor|patch` _Unless introducing breaking changes, use minor or patch_
4. Run `git commit -am <commit message>`
5. Run `git push origin main`
