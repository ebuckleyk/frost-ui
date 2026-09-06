import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../Card';
import { Input } from '../Input';
import { Label } from '../Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Make changes to your account here. Click save when you're done.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function LineTabsDemo() {
  return (
    <Tabs defaultValue="overview" className="w-[400px]">
      <TabsList variant="line" className="w-full justify-start">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Review account status and recent usage.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Line tabs keep the content surface visually quiet.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="activity">
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Track recent account events.</CardDescription>
          </CardHeader>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage tab-specific configuration.</CardDescription>
          </CardHeader>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function AnimatedTabsDemo() {
  return (
    <Tabs defaultValue="overview" animated className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>The newly selected panel fades and moves gently into place.</CardDescription>
          </CardHeader>
        </Card>
      </TabsContent>
      <TabsContent value="activity">
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Reduced-motion preferences disable the panel animation.</CardDescription>
          </CardHeader>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

type ComponentType = React.ComponentProps<typeof Tabs>;
const meta: Meta<ComponentType> = {
  component: Tabs,
  subcomponents: { TabsContent, TabsList, TabsTrigger },
  parameters: {
    docs: {
      description: {
        component:
          "Organizes related content into keyboard-accessible panels. Enable `animated` to slide the selected indicator between triggers and fade each newly selected panel into place. Animation is disabled by default and respects the user's reduced-motion preference.",
      },
    },
  },
  argTypes: {
    animated: {
      control: 'boolean',
      description: 'Animates the selected indicator and newly selected tab panel.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {
  render: TabsDemo,
};

export const Line: Story = {
  render: LineTabsDemo,
};

export const Animated: Story = {
  render: AnimatedTabsDemo,
  parameters: {
    docs: {
      description: {
        story:
          'Pass `animated` to `Tabs` to slide the selected indicator between options and apply a short panel entrance transition. The content remains accessible and motion is removed when the user requests reduced motion.',
      },
    },
  },
};
