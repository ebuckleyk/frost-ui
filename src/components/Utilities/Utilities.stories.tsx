import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Card';
import { Item, ItemContent, ItemGroup, ItemTitle } from '../Item';
import { Marker, MarkerContent, MarkerIcon } from '../Marker';
import { Spinner } from '../Spinner';

const meta: Meta = {
  title: 'Utilities/Scroll Fade and Shimmer',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj;

export const ScrollFade: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Scroll fade</CardTitle>
        <CardDescription>The fade follows the current scroll position without overlays or listeners.</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="h-64 scroll-fade-y overflow-y-auto scroll-fade-8">
          {Array.from({ length: 12 }, (_, index) => (
            <Item key={index} size="sm">
              <ItemContent>
                <ItemTitle>Conversation item {index + 1}</ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  ),
};

export const Shimmer: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Shimmer</CardTitle>
        <CardDescription>Use shimmer for live, generating, and streaming status text.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Marker role="status">
          <MarkerIcon>
            <Spinner />
          </MarkerIcon>
          <MarkerContent className="shimmer">Generating response...</MarkerContent>
        </Marker>
        <Marker role="status">
          <MarkerIcon>
            <Spinner />
          </MarkerIcon>
          <MarkerContent className="shimmer shimmer-color-primary shimmer-duration-3000">
            Reading project files...
          </MarkerContent>
        </Marker>
        <Marker role="status">
          <MarkerIcon>
            <Spinner />
          </MarkerIcon>
          <MarkerContent className="shimmer shimmer-reverse shimmer-spread-16">Running tests...</MarkerContent>
        </Marker>
      </CardContent>
    </Card>
  ),
};
