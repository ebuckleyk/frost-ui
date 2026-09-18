import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../Badge';
import { Button } from '../Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../Card';
import { Input } from '../Input';
import { Label } from '../Label';

const backgrounds = [
  ['Default', 'bg-background', 'Neutral application surface'],
  ['Ambient', 'bg-frost-ambient', 'Subtle token-driven atmosphere'],
  ['Blue / cyan', 'bg-gradient-frost', 'Cool directional treatment'],
  ['Purple', 'bg-frost-purple', 'Soft purple treatment'],
  ['Immersive', 'bg-frost-immersive', 'Strong violet and indigo atmosphere'],
] as const;

const meta: Meta = {
  title: 'Foundations/Backgrounds',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const Immersive: Story = {
  parameters: {
    backgrounds: { default: 'frost-immersive' },
  },
  render: () => (
    <main className="bg-frost-immersive min-h-screen p-6 text-foreground sm:p-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="max-w-2xl space-y-3">
          <Badge variant="secondary">FROST UI</Badge>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Immersive background</h1>
          <p className="max-w-xl text-base/7 text-muted-foreground">
            A stronger atmospheric background for focused creative experiences, with dark space reserved for crisp
            content.
          </p>
        </header>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Create a new composition</CardTitle>
            <CardDescription>Glass surfaces stay restrained while the canvas carries the atmosphere.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="composition-name">Composition name</Label>
              <Input id="composition-name" placeholder="Midnight study" />
            </div>
            <div className="glass-popover rounded-lg p-4 text-sm">
              <p className="font-medium">Surface preview</p>
              <p className="mt-1 text-muted-foreground">
                Popover and dialog opacity remains legible over the violet bloom.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="glass-control rounded-md px-3 py-2">Glass control</span>
              <span className="glass-control-muted rounded-md px-3 py-2">Muted control</span>
              <span className="glass-dialog rounded-md px-3 py-2">Dialog surface</span>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button>Create composition</Button>
            <Button variant="outline">Save draft</Button>
          </CardFooter>
        </Card>

        <p className="text-sm text-muted-foreground">
          Designed for opt-in creative workspaces, not the default application surface.
        </p>
      </div>
    </main>
  ),
};

export const Comparison: Story = {
  parameters: {
    backgrounds: { default: 'frost-ambient' },
  },
  render: () => (
    <main className="min-h-screen bg-background p-6 text-foreground sm:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold">Frost background hierarchy</h1>
        <p className="mt-2 text-muted-foreground">Equal-sized previews show the increasing atmospheric intensity.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {backgrounds.map(([name, className, description]) => (
            <section
              key={className}
              className={`${className} flex min-h-72 items-end rounded-xl border border-border p-5`}
            >
              <div className="glass-card w-full rounded-lg p-4">
                <h2 className="font-semibold">{name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  ),
};
