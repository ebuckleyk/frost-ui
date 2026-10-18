# Application typography

`Typography` (also `Text`) owns application text styles. Select an element for meaning, a `variant` for visual hierarchy, and `tone` for color. Containers own spacing. The defaults have no margins, borders or padding.

```tsx
import { Typography, Prose, typographyVariants } from '@ebuckleyk/frost-ui';
// Also exported from @ebuckleyk/frost-ui/components/Typography.

<section className="flex flex-col gap-3">
  <Typography.h1>Projects</Typography.h1>
  <Typography.h2 variant="cardTitle" tone="muted">Recent projects</Typography.h2>
  <Typography.p>Choose a project to continue.</Typography.p>
  <Typography.span variant="caption">Updated today</Typography.span>
  <Typography.p as="a" href="/projects">All projects</Typography.p>
</section>
```

| Role | Size / line height | Weight / tracking | Default elements |
| --- | --- | --- | --- |
| heading1 | 1.75rem / tight | semibold / tight | h1 |
| heading2 | 1.5rem / tight | semibold / tight | h2 |
| heading3 | 1.25rem / snug | semibold / tight | h3 |
| heading4 | 1.125rem / snug | semibold / tight | h4 |
| heading5 | 1rem / snug | semibold / tight | h5 |
| heading6 | 0.875rem / snug | semibold / tight | h6 |
| pageTitle | 2xl / tight; 3xl at sm | semibold / tight | explicit |
| sectionTitle | xl / snug | semibold / tight | explicit |
| cardTitle | base / snug | semibold / tight | explicit |
| body | base / 6 | normal / normal | p, span, div, a |
| supporting | sm / 5 | normal / normal | explicit |
| caption | xs / 4 | normal / normal | small |
| label | sm / 5 | medium / normal | label |
| control | sm / 5 | medium / normal | component recipe |
| badge | xs / 4 | semibold / normal | component recipe |
| metric | 1.5rem / tight | semibold / tight; tabular digits | explicit variant |
| eyebrow | 0.75rem / 4 | semibold / wide; uppercase | explicit variant |

Use `metric` for prominent KPI values, counts and billing totals (24px at the default root size). It uses equal-width digits for stable numeric alignment, without imposing number formatting or heading semantics. For example, `<Typography.p as="dd" variant="metric">12,480</Typography.p>` belongs inside a definition list with a descriptive `dt`.

Use `eyebrow` for short category labels above content (12px at the default root size). CSS supplies uppercase presentation; keep the source text naturally cased. Choose a heading element only when the label actually names a section, such as `<Typography.h2 variant="eyebrow" tone="muted">Audience</Typography.h2>`. Both roles inherit color unless a tone is selected, scale with the root font size, and add no spacing. See the Metrics and eyebrows story for composed examples.

Heading defaults use the same compact rem-based scale at every viewport. With a 16px root, h1–h6 resolve to 28, 24, 20, 18, 16 and 14px. They scale proportionally with the root font size; leave the root at the browser default (or a relative value) to respect font-size preferences. Line heights use unitless multipliers. Use `variant="heading1"` through `"heading6"` to select any heading appearance independently: `<Typography.h6 variant="heading1">` remains an h6. Application roles such as `cardTitle` also override heading defaults without changing semantics.

`tone` is `default` (inherit), `muted`, or `destructive`. Muting a heading never turns it into a paragraph. All h1–h6 tags and inline span are supported. `as` infers native props, event targets and refs from the chosen element. `asChild` uses Radix Slot: provide exactly one element, put that child's native props and ref on the child, and ensure custom children forward props/ref. Neither composition path adds a wrapper. When both are supplied, `asChild` takes precedence over `as`.

Use layout utilities such as `min-w-0`, `truncate`, `break-words`, or `whitespace-normal` for overflow requirements. Provide a title or another accessible route to full truncated text when needed. Avoid one-off size, weight or line-height overrides; use the shared roles. Text wraps by default; controls keep their existing one-line density and size variants.

## Component-owned text

Card, Dialog, AlertDialog, Sheet and Drawer titles use cardTitle; their descriptions use supporting/muted. Label, FieldLabel, FieldTitle and FieldLegend use label. FormLabel inherits Label; Field/Form descriptions and errors use supporting with muted/destructive tone. Button (including AlertDialog actions) uses control. Badge uses badge, increasing its former 10px letter-spaced text to readable 12px text. Existing button heights and size variants remain intact. Label line height now accommodates wrapped labels. Field-specific layout spacing remains owned by Field.

Keep specialized components: do not wrap CardTitle, DialogTitle or FieldLabel in Typography. Their existing elements, IDs, ARIA links and event behavior remain intact. `typographyVariants({ variant: 'supporting', tone: 'muted' })` exposes the exact same recipe for specialized elements without new DOM. `proseVariants` is available for explicit document rendering.

The audit deliberately leaves data presentation (Table/Chart), navigation/menu densities, input text, editor content, chat message content and decorative text such as Kbd with their existing purpose-specific recipes. They are not card titles, supporting copy or generic application labels. Further density changes should be driven by their own usage requirements, not global substitutions.

## Usage and release

Use `Typography`/`Text` for application screens and `Prose` for articles, lists, quotes and code. Choose the HTML element for semantics and an explicit visual role when the two differ. Application containers own spacing.

Document variants (`h1`, `p`, `lead`, `large`, `muted`, etc.) never change the DOM tag. Use `as` to select a different element. Prefer `variant="supporting" tone="muted"` for application supporting text.

Import the matching package release's `styles.css` (or generate Tailwind utilities from its source) alongside its JavaScript/types. This feature is queued as a minor release. There are no existing consumers to migrate.

Storybook's Foundations/Application Typography includes application versus prose, localized/long text, disabled/error states and a dialog interaction. Use the theme toolbar, narrow viewport and 200% browser zoom to inspect reflow.

## Validation

Run `npm run build`, then `npm run test:typography-types` to validate both published root and Typography subpath declarations, native props, event targets, refs and rejected invalid props. Runtime subpath exports were also imported from the built package. Run `npm run lint`, `npx vitest run --maxWorkers=2 --minWorkers=1`, and `npm run build:storybook` for repository checks.

Browser checks used the production Storybook build in Chromium at 1280px, 375px and 320px, with light/dark themes and a 200% CSS-zoom reflow check. Application headings retained semantic levels with zero margins/borders; explicit Prose retained its heading border. Long/localized labels, disabled/error fields and dialog open/close associations were verified. Native browser zoom and other browser engines remain manual checks.

The published Typography Docs route and Demo-to-Docs sidebar navigation both rendered during investigation on 2026-10-18. The reported loading failure was not reproduced. The observed favicon 404 was an unrelated root-relative asset path; the Storybook icon/manifest paths now support deployment under `/frost-ui/`.
