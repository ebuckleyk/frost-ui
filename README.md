React component library for ebuckleyk applications

### Demo

https://ebuckleyk.github.io/frost-ui/

### Installation (Vite + Tailwind v4)

1. Install package and core peer deps:
   - `npm i @ebuckleyk/frost-ui react react-dom`
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
        presets: [require('@ebuckleyk/frost-ui/presets/theme')],
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
      import '@ebuckleyk/frost-ui/styles.css';
      ```

### Peer dependencies

- Required: `react`, `react-dom`
- Optional (install only what you use): Radix UI packages, `@base-ui/react`, `date-fns`, `cmdk`, `lucide-react`, `sonner`, `vaul`, `react-hook-form`, `react-day-picker`, `recharts`, FullCalendar packages, `slate`, `input-otp`, `embla-carousel-react`, `react-dropzone`, and `dompurify`.
- Full list: see `package.json` `peerDependencies`.

### Tree-shaking imports

- Preferred (most tree-shaking):
  ```ts
  import { Button } from '@ebuckleyk/frost-ui/components/Button';
  import { useMediaQuery } from '@ebuckleyk/frost-ui/hooks/useMediaQuery';
  ```
- Root exports are still supported:
  ```ts
  import { Button } from '@ebuckleyk/frost-ui';
  ```
- CSS is opt-in:
  ```ts
  import '@ebuckleyk/frost-ui/styles.css';
  ```

### EventCalendar Slots

The EventCalendar component supports render-slot props so consuming UIs can swap pieces without forking:

- `renderToolbar` - Replace the default toolbar (navigation + view toggles).
- `renderEventContent` - Override how an event cell renders in month/week/day/list views.
- `renderEventDetails` - Replace the default Sheet details surface shown on event click.
- `renderEventEdit` - Replace the edit dialog content (used by the Edit icon in details).

Example:

```tsx
<EventCalendar
  events={events}
  renderToolbar={(props) => <CustomToolbar {...props} />}
  renderEventContent={(args) => <CustomEventCell {...args} />}
  renderEventDetails={(event) => <CustomEventDetails event={event} />}
/>
```

### How to update library

1. Run `npm run lint` _Safety check to prevent publish from failing_
2. Run `npx changeset`
3. Select `major|minor|patch` _Unless introducing breaking changes, use minor or patch_
4. Run `git commit -am <commit message>`
5. Run `git push origin main`
