---
'@ebuckleyk/frost-ui': patch
---

Add `showCloseButton` and `closeLabel` to `SheetContent`. The built-in close button remains visible with the label "Close" by default. Use `closeLabel` to localize it, or set `showCloseButton={false}` and compose a custom `SheetClose asChild` with a localized, touch-sized button. Escape, outside dismissal, dialog semantics, and focus restoration continue to use Radix behavior.
