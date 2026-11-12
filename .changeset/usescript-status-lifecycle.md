---
"@ebuckleyk/frost-ui": patch
---

Fix `useScript` status tracking. The hook now reports `loading` for a newly requested `src` until that script loads, and resets to `idle` when `src` is `null` or `shouldPreventLoad` is true. It no longer reuses a cached `ready` or `error` status after the script node is removed, so remounting with `removeOnUnmount` inserts and loads the script again. A script shared by several hook instances is only removed when the last instance using `removeOnUnmount` unmounts.
