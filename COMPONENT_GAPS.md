# Frost UI Component Gap Backlog

This backlog compares Frost UI against the current shadcn-style component surface and the library's existing wrapper strategy.

## Recommended Additions

1. `DatePicker`
   - Status: implemented and exported.
   - Rationale: the component existed only as a demo wrapper and was not available from the root component export.

2. `DataTable`
   - Status: recommended next.
   - Rationale: consumers commonly need sorting, filtering, pagination, selection, empty/loading states, and column visibility on top of the existing `Table` primitives.
   - Suggested approach: build a Frost UI wrapper on the current `Table`, `Checkbox`, `Button`, `DropdownMenu`, `Input`, `Pagination`, and `Empty` components. Avoid adding a table dependency unless feature requirements justify it.

3. `NativeSelect`
   - Status: implemented and exported.
   - Rationale: `Select` is available for custom menus, but simple forms still benefit from a native select with the same input glass treatment and mobile behavior.

4. `Direction`
   - Status: implemented and exported.
   - Rationale: the library already contains some RTL-aware classes, but there is no exported direction provider/wrapper.
   - Suggested approach: use the exported `DirectionProvider` and `useDirection` wrappers around Radix direction primitives.

## Design Requirements For New Components

- Use existing Frost UI primitives and glass utilities before adding dependencies.
- Match the restrained frost styling from `src/styles/frostui.css`.
- Include stories and snapshot tests for default, disabled, invalid, loading/empty, and dark-mode relevant states.
- Preserve shadcn-style composition APIs where practical.
