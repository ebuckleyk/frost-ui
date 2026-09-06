# Frost UI Agent Notes

## Toggle selected state contract

- Toggle selected styling must use the existing `primary` semantic token; hover and ambient feedback remain `accent`.
- Radix Toggle consumers can expose pressed state through either `data-state="on"` or `aria-pressed="true"`. Shared Toggle styling must cover both attributes. Do not add consumer-specific selected-color overrides to work around one attribute path.
- Preserve the existing focus-visible border and ring treatment. Focus location and selected value are separate signals.
- Verify both a standalone `Toggle` and a `RichTextEditor` formatting control whenever the shared Toggle state treatment changes.
