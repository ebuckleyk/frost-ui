---
"@ebuckleyk/frost-ui": patch
---

Stop `Carousel` from hijacking arrow keys inside slide content. Keyboard navigation now runs in the bubble phase and skips events that were already handled (`defaultPrevented`), carry modifier keys, or come from inputs, textareas, selects, contenteditable regions, or controls that own arrow keys (sliders, listboxes, tabs, menus, and similar). Arrow keys from the carousel itself and its non-editable content still change slides, a consumer `onKeyDown` runs first and can opt out with `preventDefault()`, and vertical carousels now also respond to ArrowUp/ArrowDown.
