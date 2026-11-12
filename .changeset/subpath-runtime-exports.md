---
"@ebuckleyk/frost-ui": patch
---

Make each `components/*` subpath's runtime entry match its type declarations. `components/Sonner` now exports `toast`, and `components/RichText` now exports `RichTextRenderer` and the RichText utility helpers, so consumers no longer need the root entry for them.
