---
'@ebuckleyk/frost-ui': patch
---

Fix `SidebarProvider` open state and keyboard shortcut handling.

- Supplying `onOpenChange` without `open` no longer freezes the sidebar. The provider is controlled only when `open` is defined. It updates its own state when uncontrolled and calls `onOpenChange` in both modes. The `sidebar_state` cookie now records the state the sidebar actually shows.
- The Ctrl/Meta+B shortcut now ignores events that a focused control already handled (`defaultPrevented`). It also ignores events from editable targets: inputs, textareas, selects, and contenteditable elements and their descendants, such as `RichTextEditor`. The shortcut still works from the rest of the page.
