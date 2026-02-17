import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar, Mail, MoreVertical, Package, Phone, Star, User } from 'lucide-react';

import { Badge } from '../Badge';
import { Button } from '../Button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from './Item';

function BasicDemo() {
  return (
    <Item>
      <ItemMedia>
        <User />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>John Doe</ItemTitle>
        <ItemDescription>Software Engineer at Acme Corp</ItemDescription>
      </ItemContent>
    </Item>
  );
}

function WithIconVariantDemo() {
  return (
    <ItemGroup>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <Mail />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>New message</ItemTitle>
          <ItemDescription>You have a new message from Sarah</ItemDescription>
        </ItemContent>
      </Item>

      <ItemSeparator />

      <Item variant="outline">
        <ItemMedia variant="icon">
          <Phone />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Missed call</ItemTitle>
          <ItemDescription>John tried to call you 5 minutes ago</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  );
}

function WithImageVariantDemo() {
  return (
    <Item variant="muted">
      <ItemMedia variant="image">
        <img src="https://i.pravatar.cc/150?img=1" alt="Profile" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Sarah Johnson</ItemTitle>
        <ItemDescription>Product Designer</ItemDescription>
      </ItemContent>
    </Item>
  );
}

function WithActionsDemo() {
  return (
    <ItemGroup>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <Package />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Order #1234</ItemTitle>
          <ItemDescription>Shipped on Dec 15, 2024</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="sm">
            Track
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical />
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  );
}

function WithHeaderAndFooterDemo() {
  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemContent>
          <ItemTitle>Weekly Team Meeting</ItemTitle>
        </ItemContent>
        <Badge>Upcoming</Badge>
      </ItemHeader>
      <ItemContent>
        <ItemDescription>Discuss project progress and next steps</ItemDescription>
      </ItemContent>
      <ItemFooter>
        <ItemContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            Monday, Jan 20 at 10:00 AM
          </div>
        </ItemContent>
        <Button variant="outline" size="sm">
          Join
        </Button>
      </ItemFooter>
    </Item>
  );
}

function SmallSizeDemo() {
  return (
    <ItemGroup>
      <Item size="sm">
        <ItemMedia>
          <Star className="size-4" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Favorites</ItemTitle>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item size="sm">
        <ItemMedia>
          <Mail className="size-4" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Inbox</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Badge variant="secondary">5</Badge>
        </ItemActions>
      </Item>
    </ItemGroup>
  );
}

function AsLinkDemo() {
  return (
    <ItemGroup>
      <Item asChild>
        <a href="#">
          <ItemMedia variant="icon">
            <User />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>View Profile</ItemTitle>
            <ItemDescription>Click to view your profile page</ItemDescription>
          </ItemContent>
        </a>
      </Item>
    </ItemGroup>
  );
}

function ComplexDemo() {
  return (
    <div className="flex flex-col gap-4">
      <ItemGroup>
        <Item variant="outline">
          <ItemMedia variant="image">
            <img src="https://i.pravatar.cc/150?img=2" alt="User" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Emma Wilson</ItemTitle>
            <ItemDescription>Shared a new design file</ItemDescription>
          </ItemContent>
          <ItemContent>
            <div className="text-sm text-muted-foreground">2 hours ago</div>
          </ItemContent>
        </Item>

        <ItemSeparator />

        <Item variant="outline">
          <ItemMedia variant="image">
            <img src="https://i.pravatar.cc/150?img=3" alt="User" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Michael Chen</ItemTitle>
            <ItemDescription>Commented on your post</ItemDescription>
          </ItemContent>
          <ItemContent>
            <div className="text-sm text-muted-foreground">5 hours ago</div>
          </ItemContent>
        </Item>
      </ItemGroup>
    </div>
  );
}

const meta: Meta<typeof Item> = {
  component: Item,
  subcomponents: {
    ItemMedia,
    ItemContent,
    ItemActions,
    ItemGroup,
    ItemSeparator,
    ItemTitle,
    ItemDescription,
    ItemHeader,
    ItemFooter,
  },
};

export default meta;

type Story = StoryObj<typeof Item>;

export const Demo: Story = {
  render: BasicDemo,
};

export const WithIconVariant: Story = {
  render: WithIconVariantDemo,
};

export const WithImageVariant: Story = {
  render: WithImageVariantDemo,
};

export const WithActions: Story = {
  render: WithActionsDemo,
};

export const WithHeaderAndFooter: Story = {
  render: WithHeaderAndFooterDemo,
};

export const SmallSize: Story = {
  render: SmallSizeDemo,
};

export const AsLink: Story = {
  render: AsLinkDemo,
};

export const Complex: Story = {
  render: ComplexDemo,
};
