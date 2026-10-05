---
"@ebuckleyk/frost-ui": minor
---

Add reusable Chat components through the dedicated `@ebuckleyk/frost-ui/components/Chat` entrypoint, powered by an application-owned `@assistant-ui/react` runtime. Compose existing Frost message and bubble components with accessible input, send and optional stop controls, viewport scrolling, pending and error states, and custom content.

Support consumer branding and styling, subtle new-message entrance animations with reduced-motion and opt-out support, and responsive Sheet/Dialog compositions. Include deterministic Storybook examples, integration documentation, and runtime/package isolation checks. Chat requires the optional `@assistant-ui/react` peer at `>=0.15.23 <0.16.0`; ordinary Frost imports remain independent of assistant-ui.
