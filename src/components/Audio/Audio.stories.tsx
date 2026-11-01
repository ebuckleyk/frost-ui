import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Audio, AudioControls } from './Audio';

const SAMPLE_AUDIO = 'https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4';
const SAMPLE_ARTWORK = 'https://image.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/thumbnail.webp?width=160&height=160';

const meta = {
  title: 'Components/Audio',
  component: Audio,
  args: {
    src: SAMPLE_AUDIO,
    mediaProps: {
      'aria-label': 'Sample episode',
      crossOrigin: 'anonymous',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A Frost-themed audio player that shares its controls and styling with \`Video\`, without a fixed 16:9 frame. Import it from \`@ebuckleyk/frost-ui/components/Audio\` and pass standard media behavior through \`mediaProps\`.

Install the optional peer with \`npm i media-chrome\`. \`className\` applies to the outer frame; other props go to the Media Controller.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[min(40rem,calc(100vw-2rem))]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Audio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `import { Audio } from '@ebuckleyk/frost-ui/components/Audio';

<Audio src="/episodes/42.mp3" mediaProps={{ 'aria-label': 'Episode 42' }} />`,
      },
    },
  },
};

export const WithArtwork: Story = {
  args: {
    artwork: SAMPLE_ARTWORK,
    artworkAlt: 'Episode cover',
  },
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `import { Audio } from '@ebuckleyk/frost-ui/components/Audio';

<Audio src="/episodes/42.mp3" artwork="/episodes/42.webp" artworkAlt="Episode 42 cover" />`,
      },
    },
  },
};

export const TranslatedLabels: Story = {
  args: {
    controls: (
      <AudioControls
        seekBackwardOffset={15}
        seekForwardOffset={30}
        labels={{
          muteUnmute: 'Silenciar o activar sonido',
          playbackProgress: 'Progreso de reproducción',
          playbackSpeed: 'Velocidad de reproducción',
          playPause: 'Reproducir o pausar',
          seekBackward: (seconds) => `Retroceder ${seconds} segundos`,
          seekForward: (seconds) => `Avanzar ${seconds} segundos`,
          volume: 'Volumen',
        }}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `AudioControls` to set seek offsets. `labels` works the same way as on `Video`.',
      },
      source: {
        language: 'tsx',
        code: `import { Audio, AudioControls } from '@ebuckleyk/frost-ui/components/Audio';

<Audio
  src="/episodes/42.mp3"
  controls={
    <AudioControls
      seekBackwardOffset={15}
      seekForwardOffset={30}
      labels={{
        playPause: t('player.playPause'),
        seekForward: (seconds) => t('player.seekForward', { seconds }),
      }}
    />
  }
/>`,
      },
    },
  },
};
