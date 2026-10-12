---
'@ebuckleyk/frost-ui': patch
---

Make PhoneInput countries a strict picker allowlist: omit International and never append excluded detected countries. Add a localized neutral placeholder and preserve excluded international and invalid drafts for application validation. This changes the previous menu-preference behavior of countries; omit the prop for unrestricted selection with all countries and International.
