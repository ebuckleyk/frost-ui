React component library for ebuckleyk applications

### Demo

https://ebuckleyk.github.io/frost-ui/

### Installation (Vite + Tailwind v4)

1. Install package and core peer deps:
   - `npm i @ebuckleyk/frost-ui react react-dom`
   - `npm i -D tailwindcss @tailwindcss/vite`
2. Add Tailwind to Vite:
   - `vite.config.ts`:

     ```ts
     import tailwindcss from '@tailwindcss/vite';
     import react from '@vitejs/plugin-react';
     import { defineConfig } from 'vite';

     export default defineConfig({
       plugins: [react(), tailwindcss()],
     });
     ```

3. Import the raw Tailwind CSS entry from your app stylesheet and add only your app-local sources:

   ```css
   @import '@ebuckleyk/frost-ui/tailwind.css';

   @source './app';
   @source './features';
   @source './shared';
   @source './main.tsx';
   ```

The raw `@ebuckleyk/frost-ui/tailwind.css` entry imports Tailwind, Frost UI design tokens, base styles, utilities, animations, and Frost UI's own package sources. Do not also import `@ebuckleyk/frost-ui/styles.css` in Tailwind v4 apps.

### CSS entrypoints

- **Tailwind v4 apps:** import `@ebuckleyk/frost-ui/tailwind.css` from your app CSS. This keeps Frost UI theme/base/utility CSS raw so your app's Tailwind build can generate both Frost UI component utilities and your app-local utilities from your own `@source` directives.
- **Utilities only:** import `@ebuckleyk/frost-ui/utilities.css` after Tailwind when a Tailwind-v4 library needs the shadcn-aligned `scroll-fade` and `shimmer` utilities without Frost UI's theme or base styles.
- **Compiled CSS compatibility:** existing consumers can continue importing `@ebuckleyk/frost-ui/styles.css` from JavaScript/TypeScript. This is precompiled CSS and is kept for backward compatibility, but it cannot scan/generate utilities that only exist in a consuming app.

### Scroll fade and shimmer utilities

The raw Tailwind entrypoints expose the complete utility APIs, including directional and parameterized forms:

```css
@import 'tailwindcss';
@import '@ebuckleyk/frost-ui/utilities.css';
```

```tsx
<div className="scroll-fade-y overflow-y-auto">...</div>
<p className="shimmer shimmer-duration-1500">Generating response...</p>
```

The common non-parameterized classes are also included in `@ebuckleyk/frost-ui/styles.css`. Parameterized classes such as `scroll-fade-8`, `shimmer-duration-1500`, and `shimmer-color-primary` require a raw Tailwind entrypoint so the consuming app can generate the requested values.

### Peer dependencies

- Required: `react`, `react-dom`
- Optional (install only what you use): Radix UI packages, `@base-ui/react`, `@shadcn/react`, `date-fns`, `cmdk`, `lucide-react`, `media-chrome`, `sonner`, `vaul`, `react-hook-form`, `react-day-picker`, `recharts`, FullCalendar packages, `slate`, `input-otp`, `embla-carousel-react`, `react-dropzone`, and `dompurify`.
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
- CSS is opt-in. Tailwind v4 apps should prefer `@ebuckleyk/frost-ui/tailwind.css`; existing compiled-CSS consumers can keep `@ebuckleyk/frost-ui/styles.css`.

### DatePicker

`DatePicker` is exported as a first-class component:

```tsx
import { DatePicker } from '@ebuckleyk/frost-ui/components/DatePicker';

function Example() {
  const [date, setDate] = React.useState<Date>();

  return <DatePicker date={date} onDateChange={setDate} />;
}
```

It supports controlled and uncontrolled usage, custom placeholder text, custom date format strings, and button/calendar class overrides.

### NativeSelect and Direction

`NativeSelect` is available for mobile-friendly native form menus that still use the Frost UI input glass treatment:

```tsx
import { NativeSelect, NativeSelectOption } from '@ebuckleyk/frost-ui/components/NativeSelect';

function Example() {
  return (
    <NativeSelect defaultValue="done">
      <NativeSelectOption value="todo">Todo</NativeSelectOption>
      <NativeSelectOption value="done">Done</NativeSelectOption>
    </NativeSelect>
  );
}
```

`DirectionProvider` and `useDirection` are exported from `@ebuckleyk/frost-ui/components/Direction` for RTL-aware layouts.

### Conversation components

`Attachment`, `Bubble`, `Marker`, and `Message` provide composable conversation surfaces. `MessageScroller` adds streaming-aware transcript scrolling and requires the optional `@shadcn/react` peer dependency:

```sh
npm i @shadcn/react
```

Each component supports direct, tree-shakable imports such as `@ebuckleyk/frost-ui/components/Attachment`.

### RichTextEditor emoji picker

Emoji insertion is opt-in. Add `emoji` to an explicit toolbar capability list to show the picker alongside the requested formatting controls:

```tsx
import { EMPTY_RICH_TEXT_VALUE, RichTextEditor, type RichTextValue } from '@ebuckleyk/frost-ui';

function Editor() {
  const [value, setValue] = React.useState<RichTextValue>(EMPTY_RICH_TEXT_VALUE);

  return <RichTextEditor value={value} onValueChange={setValue} toolbar={['bold', 'italic', 'emoji']} />;
}
```

The emoji picker is excluded from the default `basic` and `document` presets. Its code and emoji data load only after the picker is first opened, and subsequent openings reuse the loaded picker.

### Video

`Video` is a Frost-themed Media Chrome player. Install its optional peer dependency, then import the component from its dedicated entrypoint. Keeping Video out of the root entrypoint means apps that do not use video do not need to install Media Chrome:

```sh
npm i media-chrome
```

```tsx
import { Video } from '@ebuckleyk/frost-ui/components/Video';

export function ProductTour() {
  return (
    <Video
      src="/videos/product-tour.mp4"
      poster="/videos/product-tour.webp"
      captions={[{ src: '/captions/en.vtt', srcLang: 'en', label: 'English', default: true }]}
      chapters={[{ src: '/chapters.vtt', srcLang: 'en', label: 'Chapters', default: true }]}
      thumbnails={{ src: '/storyboard.vtt' }}
      mediaProps={{ playsInline: true }}
    />
  );
}
```

Use `controls={<VideoAdvancedControls />}` for seek buttons, settings menus, casting, AirPlay, and error feedback. `VideoControls` and the exported `Video*Button`, `Video*Range`, and `Video*Display` primitives support custom layouts using only Frost UI imports. Pass `controls={false}` for ambient media, and use `mediaProps` for native video attributes and event handlers.

Controller capabilities such as `defaultDuration`, `defaultStreamType`, `defaultSubtitles`, `lang`, `noHotkeys`, and keyboard seek offsets are accepted directly by `Video`. Transport-specific playback engines such as HLS, DASH, YouTube, and Vimeo are intentionally not bundled by this component.

#### Media Chrome feature coverage

The component follows Media Chrome's getting-started patterns while keeping the public surface Frost-native:

| Use case                                              | Frost UI API                                              |
| ----------------------------------------------------- | --------------------------------------------------------- |
| Basic and responsive player                           | `Video`; use `className` for container size/aspect ratio  |
| Captions, chapters, thumbnails                        | `captions`, `chapters`, and `thumbnails` WebVTT props     |
| Multiple sources or custom tracks                     | `sources`, `tracks`, `VideoSource`, and `VideoTrack`      |
| Advanced controls and settings                        | `controls={<VideoAdvancedControls />}`                    |
| Custom or standalone-style controls                   | Compose `VideoControls` with exported `Video*` primitives |
| Disabled controls                                     | `controls={false}`                                        |
| Autoplay, loop, preload, native events                | `mediaProps`                                              |
| Keyboard, gestures, live state, language, breakpoints | Pass Media Controller props directly to `Video`           |

Media Chrome's animated icons, state synchronization, responsive breakpoints, and platform-aware control visibility remain active underneath the Frost styling. For localized control strings, load a Media Chrome language module once in your application and set `lang` on `Video`:

```tsx
import 'media-chrome/lang/es';

import { Video } from '@ebuckleyk/frost-ui/components/Video';

<Video lang="es" src="/videos/product-tour.mp4" />;
```

Streaming adapters and provider-specific media elements stay composable rather than becoming hard dependencies: use a custom control composition around the appropriate Media Chrome-compatible media element when an MP4/WebM source is not sufficient.

### Questionnaire

`Questionnaire` provides an accessible, multi-step form flow with single or multiple choices, freeform answers, required validation, optional skips, progress, and keyboard shortcuts:

```tsx
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@ebuckleyk/frost-ui/components/Questionnaire';
```

Pass the ordered item definitions to `Questionnaire`, then compose each item from its title, choices or freeform input, error state, and navigation actions.

### Default Backgrounds

Frost UI includes four optional page/app background utilities:

- `.bg-frost-ambient` - subtle token-driven ambient background.
- `.bg-gradient-frost` - blue/cyan atmospheric treatment.
- `.bg-frost-purple` - soft purple treatment.
- `.bg-frost-immersive` - high-contrast violet/indigo atmosphere for focused creative surfaces.

These presets are also available from the Storybook background toolbar for release previews, including explicit dark-mode background entries.
The immersive treatment is opt-in and does not replace the default application background or dark theme. It does not alter global theme tokens.

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

### Component Backlog

See `COMPONENT_GAPS.md` for the shadcn-aligned component gap backlog. Current recommended addition is `DataTable`.

### How to update library

1. Run `npm run lint` _Safety check to prevent publish from failing_
2. Run `npx changeset`
3. Select `major|minor|patch` _Unless introducing breaking changes, use minor or patch_
4. Run `git commit -am <commit message>`
5. Run `git push origin main`
