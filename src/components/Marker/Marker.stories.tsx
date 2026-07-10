import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { GitBranchIcon, SearchIcon } from 'lucide-react';

import { Spinner } from '../Spinner';
import { Marker, MarkerContent, MarkerIcon } from './Marker';

const meta: Meta<typeof Marker> = { component: Marker };
export default meta;
type Story = StoryObj<typeof Marker>;

export const Demo: Story = {
  render: () => (
    <div className="flex min-h-96 w-full max-w-2xl items-center rounded-xl border border-(--glass-edge) bg-card/20 p-8">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-7">
        <Marker>
          <MarkerIcon>
            <GitBranchIcon />
          </MarkerIcon>
          <MarkerContent>Switched to a new branch</MarkerContent>
        </Marker>

        <Marker role="status">
          <MarkerIcon>
            <Spinner />
          </MarkerIcon>
          <MarkerContent className="shimmer">Thinking...</MarkerContent>
        </Marker>

        <Marker variant="separator">
          <MarkerContent>Conversation compacted</MarkerContent>
        </Marker>

        <Marker>
          <MarkerIcon>
            <SearchIcon />
          </MarkerIcon>
          <MarkerContent>Explored 4 files</MarkerContent>
        </Marker>
      </div>
    </div>
  ),
};
