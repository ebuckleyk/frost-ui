import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '../Input';
import { Checkbox } from '../Checkbox';
import { Switch } from '../Switch';
import { RadioGroup, RadioGroupItem } from '../RadioGroup';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from './Field';

function VerticalFieldDemo() {
  return (
    <Field orientation="vertical">
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" type="email" placeholder="Enter your email" />
      <FieldDescription>We'll never share your email with anyone else.</FieldDescription>
    </Field>
  );
}

function HorizontalFieldDemo() {
  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="notifications">Enable notifications</FieldLabel>
        <Switch id="notifications" />
        <FieldDescription>Receive email notifications for important updates.</FieldDescription>
      </Field>
    </FieldGroup>
  );
}

function ResponsiveFieldDemo() {
  return (
    <FieldGroup>
      <Field orientation="responsive">
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" placeholder="johndoe" />
        <FieldDescription>Choose a unique username for your account.</FieldDescription>
      </Field>
    </FieldGroup>
  );
}

function WithErrorDemo() {
  return (
    <Field orientation="vertical" data-invalid="true">
      <FieldLabel htmlFor="password">Password</FieldLabel>
      <Input id="password" type="password" aria-invalid="true" />
      <FieldError>Password must be at least 8 characters long.</FieldError>
    </Field>
  );
}

function WithMultipleErrorsDemo() {
  return (
    <Field orientation="vertical" data-invalid="true">
      <FieldLabel htmlFor="confirm">Confirm Password</FieldLabel>
      <Input id="confirm" type="password" aria-invalid="true" />
      <FieldError
        errors={[{ message: 'Passwords do not match' }, { message: 'Password must contain a number' }]}
      />
    </Field>
  );
}

function FieldSetDemo() {
  return (
    <FieldSet>
      <FieldLegend>Account Settings</FieldLegend>
      <Field orientation="vertical">
        <FieldLabel htmlFor="name">Full Name</FieldLabel>
        <Input id="name" placeholder="John Doe" />
      </Field>
      <Field orientation="vertical">
        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <Input id="bio" placeholder="Tell us about yourself" />
      </Field>
    </FieldSet>
  );
}

function WithCheckboxDemo() {
  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <Checkbox id="terms" />
        <FieldLabel htmlFor="terms">
          <FieldTitle>Accept terms and conditions</FieldTitle>
          <FieldContent>
            <FieldDescription>
              You agree to our Terms of Service and Privacy Policy.
            </FieldDescription>
          </FieldContent>
        </FieldLabel>
      </Field>
    </FieldGroup>
  );
}

function WithSeparatorDemo() {
  return (
    <FieldGroup>
      <Field orientation="vertical">
        <FieldLabel htmlFor="email1">Email</FieldLabel>
        <Input id="email1" type="email" />
      </Field>
      <FieldSeparator>or</FieldSeparator>
      <Field orientation="vertical">
        <FieldLabel htmlFor="phone">Phone</FieldLabel>
        <Input id="phone" type="tel" />
      </Field>
    </FieldGroup>
  );
}

function RadioGroupFieldDemo() {
  return (
    <FieldSet>
      <FieldLegend variant="label">Notification Preferences</FieldLegend>
      <RadioGroup defaultValue="all">
        <Field orientation="horizontal">
          <RadioGroupItem value="all" id="all" />
          <FieldLabel htmlFor="all">All notifications</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="important" id="important" />
          <FieldLabel htmlFor="important">Important only</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="none" id="none" />
          <FieldLabel htmlFor="none">None</FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  );
}

const meta: Meta<typeof Field> = {
  component: Field,
  subcomponents: {
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldContent,
    FieldTitle,
  },
};

export default meta;

type Story = StoryObj<typeof Field>;

export const Vertical: Story = {
  render: VerticalFieldDemo,
};

export const Horizontal: Story = {
  render: HorizontalFieldDemo,
};

export const Responsive: Story = {
  render: ResponsiveFieldDemo,
};

export const WithError: Story = {
  render: WithErrorDemo,
};

export const WithMultipleErrors: Story = {
  render: WithMultipleErrorsDemo,
};

export const FieldSetExample: Story = {
  render: FieldSetDemo,
};

export const WithCheckbox: Story = {
  render: WithCheckboxDemo,
};

export const WithSeparator: Story = {
  render: WithSeparatorDemo,
};

export const RadioGroupExample: Story = {
  render: RadioGroupFieldDemo,
};
