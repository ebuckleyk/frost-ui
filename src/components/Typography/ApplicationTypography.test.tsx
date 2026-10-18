import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { Button } from '../Button';
import { CardTitle } from '../Card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../Dialog';
import { FieldDescription, FieldError, FieldLabel } from '../Field';
import { Prose, Typography, typographyVariants } from './Typography';

describe('application typography', () => {
  it('routes metric and eyebrow variants to application recipes without changing semantics', () => {
    render(
      <section>
        <Typography.h2 variant="eyebrow" tone="muted">
          Audience
        </Typography.h2>
        <dl>
          <dt>Subscribers</dt>
          <Typography.p as="dd" variant="metric">
            12,480
          </Typography.p>
        </dl>
      </section>,
    );
    expect(screen.getByRole('heading', { level: 2 }).className).toBe(
      typographyVariants({ variant: 'eyebrow', tone: 'muted' }),
    );
    const value = screen.getByText('12,480');
    expect(value.tagName).toBe('DD');
    expect(value.className).toBe(typographyVariants({ variant: 'metric' }));
  });

  it('gives all six semantic heading levels distinct spacing-neutral defaults', () => {
    render(
      <>
        <Typography.h1>One</Typography.h1>
        <Typography.h2>Two</Typography.h2>
        <Typography.h3>Three</Typography.h3>
        <Typography.h4>Four</Typography.h4>
        <Typography.h5>Five</Typography.h5>
        <Typography.h6>Six</Typography.h6>
      </>,
    );
    const headings = screen.getAllByRole('heading');
    expect(new Set(headings.map((heading) => heading.className)).size).toBe(6);
    headings.forEach((heading, index) => {
      expect(heading.tagName).toBe(`H${index + 1}`);
      expect(heading).not.toHaveClass('border-b', 'pb-2', 'not-first:mt-4');
    });
  });

  it('overrides heading appearance without changing semantic level or ref', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(
      <>
        <Typography.h1 variant="heading6">Small h1</Typography.h1>
        <Typography.h6 ref={ref} variant="heading1" tone="muted">
          Large h6
        </Typography.h6>
        <Typography.h1>Default h1</Typography.h1>
        <Typography.h6>Default h6</Typography.h6>
      </>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Small h1' }).className).toBe(
      screen.getByText('Default h6').className,
    );
    const large = screen.getByRole('heading', { level: 6, name: 'Large h6' });
    expect(large).toBe(ref.current);
    expect(large).toHaveClass(screen.getByText('Default h1').className);
    expect(large).toHaveClass('text-muted-foreground');
  });

  it('keeps heading semantics for muted and legacy visual variants', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(
      <Typography.h6 ref={ref} variant="muted">
        Still a heading
      </Typography.h6>,
    );
    expect(screen.getByRole('heading', { level: 6 })).toBe(ref.current);
    expect(ref.current).toHaveClass('text-muted-foreground');
  });

  it('forwards native props, refs and handlers with an explicit element', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    const click = vi.fn();
    render(
      <Typography.p as="a" href="#details" ref={ref} onClick={click} aria-label="Details">
        Open
      </Typography.p>,
    );
    const link = screen.getByRole('link', { name: 'Details' });
    expect(link).toBe(ref.current);
    expect(link).toHaveAttribute('href', '#details');
    fireEvent.click(link);
    expect(click).toHaveBeenCalledOnce();
  });

  it('composes a child without a wrapper and preserves its handler and ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const click = vi.fn();
    const { container } = render(
      <Typography.span asChild variant="control">
        <button ref={ref} onClick={click}>
          Save
        </button>
      </Typography.span>,
    );
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(ref.current);
    fireEvent.click(screen.getByRole('button'));
    expect(click).toHaveBeenCalledOnce();
  });

  it('defaults to spacing-neutral application text while keeping prose explicit', () => {
    const { container } = render(
      <>
        <Typography.h2>Section</Typography.h2>
        <Typography.p>Body</Typography.p>
        <Typography.span>Inline</Typography.span>
        <Prose.h2>Article</Prose.h2>
        <Prose.p>Paragraph</Prose.p>
      </>,
    );
    const [heading, body, inline, proseHeading, proseBody] = Array.from(container.children);
    expect(heading).not.toHaveClass('border-b', 'pb-2');
    expect(body).not.toHaveClass('not-first:mt-4');
    expect(inline.tagName).toBe('SPAN');
    expect(proseHeading).toHaveClass('border-b', 'pb-2');
    expect(proseBody).toHaveClass('not-first:mt-4');
  });

  it('preserves label association, errors, disabled buttons and component-owned elements', () => {
    render(
      <>
        <CardTitle>Card</CardTitle>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <input id="name" aria-describedby="help error" />
        <FieldDescription id="help">Help</FieldDescription>
        <FieldError id="error">Required</FieldError>
        <Button disabled>Save</Button>
      </>,
    );
    expect(screen.getByLabelText('Name')).toHaveAccessibleDescription('Help Required');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Card').tagName).toBe('DIV');
    expect(screen.getByText('Name').tagName).toBe('LABEL');
  });

  it('retains dialog title and description associations without nested headings', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage preferences</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole('dialog')).toHaveAccessibleName('Settings');
    expect(screen.getByRole('dialog')).toHaveAccessibleDescription('Manage preferences');
    expect(screen.getAllByRole('heading')).toHaveLength(1);
  });
});
