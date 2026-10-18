import * as React from 'react';
import { Prose, Typography, typographyVariants } from '@ebuckleyk/frost-ui';
import { Text } from '@ebuckleyk/frost-ui/components/Typography';

const anchor = React.createRef<HTMLAnchorElement>();
const heading = React.createRef<HTMLHeadingElement>();
const input = React.createRef<HTMLInputElement>();

<Typography.h6 ref={heading} tone="muted" variant="pageTitle" />;
<Typography.h6 ref={heading} variant="heading1" />;
<Typography.h1 variant="heading6" />;
<Typography.p as="dd" variant="metric" />;
<Text.h2 variant="eyebrow" tone="muted" />;
<Typography.p as="a" href="/projects" ref={anchor} onClick={(event) => event.currentTarget.href} />;
<Typography.span as="input" ref={input} type="email" onChange={(event) => event.currentTarget.value} />;
<Text.label htmlFor="email" />;
<Prose.td colSpan={2} />;
<Typography.span asChild>
  <a href="/projects" ref={anchor}>
    Projects
  </a>
</Typography.span>;
typographyVariants({ variant: 'cardTitle', tone: 'muted' });

// @ts-expect-error paragraphs do not have href
<Typography.p href="/projects" />;
// @ts-expect-error anchor refs cannot point at inputs
<Typography.p as="a" ref={input} />;
// @ts-expect-error only supported roles/styles are allowed
<Typography.p variant="custom-title" />;
// @ts-expect-error native properties follow the selected element
<Typography.span as="button" href="/projects" />;
