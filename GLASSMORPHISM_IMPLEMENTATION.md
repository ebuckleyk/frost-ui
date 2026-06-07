# Frost UI Glassmorphism Implementation

## Overview

Frost UI's glass system is implemented with CSS variables and reusable utility classes in `src/styles/frostui.css`. The goal is professional, restrained frost: translucent surfaces, subtle blur, crisp borders, readable text, and consistent elevation.

## Glass Tokens

Core tokens:

- `--glass-blur`
- `--glass-saturation`
- `--glass-opacity`
- `--glass-border-opacity`
- `--glass-focus-opacity`
- `--glass-card`
- `--glass-popover`
- `--glass-dialog`
- `--glass-button`
- `--glass-overlay`

Surface tokens:

- `--glass-edge`
- `--glass-edge-soft`
- `--glass-highlight`
- `--glass-highlight-soft`
- `--glass-shadow`
- `--glass-shadow-soft`
- `--glass-ambient-*`
- `--glass-overlay-*`

Dark mode increases blur, edge visibility, and shadow depth while keeping popovers/dialogs opaque enough for readable menus and forms.

## Utility Classes

- `.glass` - generic translucent surface.
- `.glass-card` - card and contained surface treatment.
- `.glass-popover` - menus, popovers, comboboxes, and floating panels.
- `.glass-dialog` - modal, sheet, and drawer surfaces.
- `.glass-overlay` - dimmed frosted overlays.
- `.glass-control` - interactive button/control surface.
- `.glass-control-muted` - secondary controls, toggles, switches, and subtle controls.
- `.input-glass` - inputs, textareas, selects, chips, sliders, checkboxes, and radios.
- `.shadow-frost-sm`, `.shadow-frost-md`, `.shadow-frost-lg`, `.shadow-frost-glow` - elevation helpers.
- `.bg-frost-ambient` - optional page/app background treatment.
- `.bg-gradient-frost` - soft blue/cyan page background treatment.
- `.bg-frost-purple` - soft purple page background treatment.

Glass surfaces avoid strong internal gradients so text, icons, and form labels stay readable. Background presets carry the subtle color atmosphere behind the components instead.

## Component Coverage

The current implementation applies the glass system to:

- Surfaces: `Card`, `Alert`, `Dialog`, `Sheet`, `Drawer`, `Popover`, menus, `Calendar`, `Sidebar`.
- Controls: `Button`, `Input`, `Textarea`, `Select`, `NativeSelect`, `Combobox`, `Checkbox`, `Switch`, `Slider`, `Toggle`, `RadioGroup`.
- Data/display: `Table`, `Badge`, `Empty`, `Item`, `Skeleton`, `Progress`, `Pagination`.
- Feedback: `SonnerToaster` inherits glass surface variables and toast CSS selectors.

## Motion And Accessibility

- Reduced-motion users get near-zero animation and transition durations through the global reduced-motion media query.
- Focus states use `--glass-focus-opacity` to keep keyboard outlines visible against translucent backgrounds.
- Popovers and dialogs use higher opacity than decorative surfaces for readability.
