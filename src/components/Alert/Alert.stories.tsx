import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { AlertCircleIcon, InfoIcon, RefreshCwIcon, Terminal, TriangleAlertIcon } from 'lucide-react';

import { Button } from '../Button';
import { Alert, AlertAction, AlertClose, AlertDescription, AlertTitle } from './Alert';

function AlertDemo(props) {
  return (
    <Alert {...props} className="max-w-[380px]">
      <Terminal className="size-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  );
}

type ComponentType = React.ComponentProps<typeof Alert>;
const meta: Meta<ComponentType> = {
  title: 'Components/Alert',
  component: Alert,
  subcomponents: { AlertAction, AlertClose, AlertDescription, AlertTitle },
  render: ({ ...args }) => <AlertDemo {...args} />,
  parameters: {
    docs: {
      description: {
        component: `Alerts communicate important inline feedback. Use the default layout for compact callouts and a banner layout for prominent page- or section-level messages. \`layout="banner"\` places actions beside the message when space allows, while \`layout="banner-stacked"\` keeps actions beneath the description at every viewport.

Compose banner controls with \`AlertAction\` and \`AlertClose\`. Dismissal is intentionally controlled by the consuming application so it can decide whether the alert returns after navigation, reload, or a new event. \`AlertClose\` renders a labeled dismiss button by default and accepts custom children when another control is needed.

\`Alert\` uses \`role="alert"\` by default for dynamically displayed, time-sensitive feedback. For static or non-urgent content, set \`role="status"\` or another appropriate role.`,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
    },
    layout: {
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="grid gap-4">
      <Alert>
        <Terminal />
        <AlertTitle>Default alert</AlertTitle>
        <AlertDescription>General guidance that does not require special attention.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>A new dashboard is available for you to try.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Your session expires soon. Save your work before continuing.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>We couldn’t save your changes. Try again.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const ErrorBanner: Story = {
  render: function ErrorBannerStory() {
    const [visible, setVisible] = React.useState(true);

    if (!visible) {
      return <Button onClick={() => setVisible(true)}>Show error banner</Button>;
    }

    return (
      <Alert variant="destructive" layout="banner">
        <AlertCircleIcon />
        <AlertTitle>We couldn’t save your changes</AlertTitle>
        <AlertDescription>Your connection was interrupted. Try again without losing your work.</AlertDescription>
        <AlertAction>
          <Button variant="outline" size="sm" onClick={() => undefined}>
            <RefreshCwIcon data-icon="inline-start" />
            Try again
          </Button>
        </AlertAction>
        <AlertClose onClick={() => setVisible(false)} />
      </Alert>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'A responsive error banner with a retry action and consumer-controlled dismissal. On narrow screens, actions move below the message.',
      },
    },
  },
};

export const WarningBanner: Story = {
  render: () => (
    <Alert variant="warning" layout="banner">
      <TriangleAlertIcon />
      <AlertTitle>Your session expires soon</AlertTitle>
      <AlertDescription>Save your work before continuing to avoid losing recent changes.</AlertDescription>
    </Alert>
  ),
};

export const InfoBanner: Story = {
  render: () => (
    <Alert variant="info" layout="banner">
      <InfoIcon />
      <AlertTitle>A new dashboard is available</AlertTitle>
      <AlertDescription>You can switch back to the previous experience from settings.</AlertDescription>
    </Alert>
  ),
};

export const StaticBanner: Story = {
  render: () => (
    <Alert layout="banner" role="status">
      <Terminal />
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription>The dashboard will be read-only from 02:00–02:30 UTC.</AlertDescription>
      <AlertAction>
        <Button variant="outline" size="sm">
          View details
        </Button>
      </AlertAction>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Static, non-urgent banners can use `role="status"` and omit the dismiss control.',
      },
    },
  },
};

export const StackedActionsBanner: Story = {
  render: () => (
    <Alert variant="destructive" layout="banner-stacked">
      <AlertCircleIcon />
      <AlertTitle>Your session has expired</AlertTitle>
      <AlertDescription>
        Sign in again to continue. Any unsaved changes remain available in this browser.
      </AlertDescription>
      <AlertAction>
        <Button variant="outline" size="sm">
          Sign in again
        </Button>
        <Button variant="ghost" size="sm">
          Return home
        </Button>
      </AlertAction>
      <AlertClose />
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: '`layout="banner-stacked"` keeps one or more actions directly beneath the description.',
      },
    },
  },
};
