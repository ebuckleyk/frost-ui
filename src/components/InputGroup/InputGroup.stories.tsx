import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { Search, DollarSign, Send, AtSign, Lock, Eye, EyeOff, MessageSquare } from 'lucide-react';

import { Kbd } from '../Kbd';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from './InputGroup';

function BasicDemo() {
  return (
    <InputGroup>
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
    </InputGroup>
  );
}

function WithIconsDemo() {
  return (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <AtSign />
        </InputGroupAddon>
        <InputGroupInput type="email" placeholder="email@example.com" />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
          <DollarSign />
        </InputGroupAddon>
        <InputGroupInput type="number" placeholder="0.00" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function WithButtonDemo() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Enter your message" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>
            <Send />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
          <Lock />
        </InputGroupAddon>
        <InputGroupInput type={showPassword ? 'text' : 'password'} placeholder="Password" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function WithTextDemo() {
  return (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" />
      </InputGroup>

      <InputGroup>
        <InputGroupInput placeholder="username" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>@company.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function WithKbdDemo() {
  return (
    <InputGroup>
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
}

function BlockAlignmentDemo() {
  return (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupAddon align="block-start">
          <InputGroupText>Subject</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Enter subject" />
      </InputGroup>

      <InputGroup>
        <InputGroupInput placeholder="Enter text" />
        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupButton size="sm">Submit</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function WithTextareaDemo() {
  return (
    <InputGroup>
      <InputGroupAddon align="block-start">
        <MessageSquare />
        <InputGroupText>Message</InputGroupText>
      </InputGroupAddon>
      <InputGroupTextarea placeholder="Type your message here..." rows={4} />
      <InputGroupAddon align="block-end" className="border-t">
        <InputGroupButton size="sm">Send</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

const meta: Meta<typeof InputGroup> = {
  component: InputGroup,
  subcomponents: { InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea },
};

export default meta;

type Story = StoryObj<typeof InputGroup>;

export const Demo: Story = {
  render: BasicDemo,
};

export const WithIcons: Story = {
  render: WithIconsDemo,
};

export const WithButton: Story = {
  render: WithButtonDemo,
};

export const WithText: Story = {
  render: WithTextDemo,
};

export const WithKbd: Story = {
  render: WithKbdDemo,
};

export const BlockAlignment: Story = {
  render: BlockAlignmentDemo,
};

export const WithTextarea: Story = {
  render: WithTextareaDemo,
};
