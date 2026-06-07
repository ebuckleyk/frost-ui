# Frost UI Color System

## Overview

Frost UI uses OKLCH CSS variables for a restrained glassmorphism palette. The palette keeps blue as the primary action color, adds cyan-green accent surfaces to avoid a one-note blue interface, and keeps foreground/background contrast high in both light and dark mode.

## Core Tokens

The public color tokens live in `src/styles/frostui.css`:

- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--border`, `--input`, `--ring`
- `--sidebar-*`

The Tailwind preset in `src/styles/theme-preset.js` maps directly to these OKLCH variables. Do not wrap the variables in `hsl(...)`; the token values are already complete CSS colors.

## Visual Direction

- Light mode uses near-white blue-neutral surfaces with muted blue borders.
- Dark mode uses deep navy-neutral surfaces with clearer glass edges while keeping primary actions close to the light-mode brand blue.
- Accent surfaces use a cooler cyan-green hue so hover, selected, and ambient states do not all read as the same blue.
- Destructive colors stay warm red for clear semantic separation.

## Accessibility Guidance

- Use `text-foreground` on app backgrounds and glass cards.
- Use `text-muted-foreground` for supporting copy, labels, descriptions, and captions.
- Avoid placing `text-muted-foreground` on `bg-muted` for essential information.
- Use `focus-visible:ring-ring/50` or the existing component focus classes for keyboard-visible focus.

## Consumer Guidance

Tailwind v4 consumers should import:

```css
@import '@ebuckleyk/frost-ui/tailwind.css';
```

Then add only app-local `@source` entries. Do not import both `tailwind.css` and `styles.css` in the same Tailwind v4 app.
