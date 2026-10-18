import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../Badge';
import { Button } from '../Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Card';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../Dialog';
import { Field, FieldDescription, FieldError, FieldLabel } from '../Field';
import { Input } from '../Input';
import { Prose, Typography } from './Typography';

const meta = {
  title: 'Foundations/Application Typography',
  component: Typography.p,
  parameters: {
    docs: {
      description: {
        component:
          'Typography/Text default to spacing-neutral application roles. Choose the HTML tag for meaning, variant for appearance, and tone for color. Use Prose for article margins, heading borders, lists, quotes and code. Containers own application spacing. Specialized components already use these recipes; do not nest Typography inside their titles or labels. See docs/typography.md for usage guidance.',
      },
    },
  },
} satisfies Meta<typeof Typography.p>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ApplicationAndProse: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-8 p-4 md:grid-cols-2">
      <section className="flex min-w-0 flex-col gap-3">
        <Typography.h1>Application title</Typography.h1>
        <Typography.h2 tone="muted">A muted section heading</Typography.h2>
        <Typography.h3>Card title</Typography.h3>
        <Typography.p>Body text has no sibling margins. The container owns the gap.</Typography.p>
        <Typography.p variant="supporting" tone="muted">
          Supporting text explains the next step.
        </Typography.p>
        <Typography.span variant="caption">Caption · Last updated today</Typography.span>
        <Typography.p as="a" href="#details">
          A typed link with body styling
        </Typography.p>
        <Typography.p className="truncate" title="A long project name that is intentionally truncated">
          A long project name that is intentionally truncated
        </Typography.p>
      </section>
      <article id="details">
        <Prose.h2>Explicit document styles</Prose.h2>
        <Prose.p>Articles retain their own vertical rhythm and heading borders.</Prose.p>
        <Prose.p>A second paragraph demonstrates document spacing.</Prose.p>
        <Prose.ul>
          <Prose.li>Lists retain their markers.</Prose.li>
        </Prose.ul>
        <Prose.blockquote>Quotes retain their border and indentation.</Prose.blockquote>
        <Prose.p>
          Use <Prose.code>Prose</Prose.code> for document content.
        </Prose.p>
      </article>
    </div>
  ),
};

export const ComponentComposition: Story = {
  render: () => (
    <div className="w-full max-w-lg p-4">
      <Card>
        <CardHeader>
          <CardTitle>Benachrichtigungseinstellungen für internationale Zusammenarbeit</CardTitle>
          <CardDescription>Manage updates for your team across regions and languages.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Badge>Review required</Badge>
          <Field data-invalid="true">
            <FieldLabel htmlFor="application-email">
              Email address for project notifications and important account updates
            </FieldLabel>
            <Input id="application-email" aria-invalid="true" aria-describedby="application-help application-error" />
            <FieldDescription id="application-help">
              このメールアドレスにプロジェクトの更新情報を送信します。
            </FieldDescription>
            <FieldError id="application-error">Enter a valid email address to continue.</FieldError>
          </Field>
          <Field data-disabled="true">
            <FieldLabel htmlFor="application-plan">Organization plan</FieldLabel>
            <Input id="application-plan" value="Managed by your administrator" disabled />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button disabled>Save changes</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Review settings</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Review notification settings</DialogTitle>
                <DialogDescription>
                  Titles and descriptions use shared roles while preserving their dialog associations.
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

export const DarkComposition: Story = { ...ComponentComposition, parameters: { theme: 'dark' } };
