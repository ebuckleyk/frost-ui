'use client';

import * as React from 'react';

const mediaThemeClassName = `
  [--media-button-icon-height:1.5rem]
  [--media-control-background:transparent]
  [--media-control-height:1.5rem]
  [--media-control-hover-background:color-mix(in_oklch,var(--accent)_32%,transparent)]
  [--media-control-padding:0.625rem]
  [--media-focus-box-shadow:inset_0_0_0_2px_var(--primary)]
  [--media-font-family:inherit]
  [--media-font-size:0.75rem]
  [--media-font-weight:500]
  [--media-primary-color:var(--primary-foreground)]
  [--media-range-bar-color:var(--primary)]
  [--media-range-thumb-background:var(--primary)]
  [--media-range-thumb-box-shadow:0_0_0_3px_color-mix(in_oklch,var(--primary)_24%,transparent)]
  [--media-range-thumb-height:0.75rem]
  [--media-range-thumb-width:0.75rem]
  [--media-range-track-background:color-mix(in_oklch,var(--primary-foreground)_28%,transparent)]
  [--media-range-track-border-radius:9999px]
  [--media-range-track-height:0.25rem]
  [--media-secondary-color:color-mix(in_oklch,var(--background)_72%,transparent)]
`;

type MediaControlElement = HTMLElement & { range?: HTMLElement };

type LabeledControlProps = {
  as: React.ElementType;
  defaultLabel: string;
  label?: string;
  /** Ranges have no tooltip to replace. */
  tooltip?: boolean;
  className?: string;
  seekOffset?: number;
};

/**
 * Media Chrome rewrites `aria-label` on connect and on state changes, and ranges label an inner input,
 * so an explicit `label` is re-applied whenever it is replaced. Without one, Media Chrome's own
 * state-aware and `lang`-aware text stays in charge.
 */
function LabeledControl({ as: Control, defaultLabel, label, tooltip = true, ...props }: LabeledControlProps) {
  const ref = React.useRef<MediaControlElement>(null);

  React.useEffect(() => {
    const target = ref.current?.range ?? ref.current;
    if (!target || label === undefined) return;

    const applyLabel = () => {
      if (target.getAttribute('aria-label') !== label) target.setAttribute('aria-label', label);
    };
    applyLabel();

    const observer = new MutationObserver(applyLabel);
    observer.observe(target, { attributes: true, attributeFilter: ['aria-label'] });
    return () => observer.disconnect();
  }, [label]);

  return (
    <Control ref={ref} aria-label={label ?? defaultLabel} {...props}>
      {tooltip && label !== undefined ? <span slot="tooltip-content">{label}</span> : null}
    </Control>
  );
}

export { LabeledControl, mediaThemeClassName };
