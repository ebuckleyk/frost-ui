import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './HoverCard';
import { Avatar, AvatarFallback, AvatarImage } from '../Avatar';
import { Button } from '../Button';
import { Card } from '../Card';

function HoverCardDemo() {
  return (
    <Card className="flex p-5">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">@nextjs</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/vercel.png" />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@nextjs</h4>
              <p className="text-sm">The React Framework – created and maintained by @vercel.</p>
              <div className="flex items-center pt-2">
                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{' '}
                <span className="text-xs text-muted-foreground">Joined December 2021</span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </Card>
  );
}
type ComponentType = React.ComponentProps<typeof HoverCard>;
const meta: Meta<ComponentType> = {
  component: HoverCard,
  render: HoverCardDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
