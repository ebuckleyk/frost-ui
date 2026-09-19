import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Video,
  VideoAdvancedControls,
  VideoControls,
  VideoFullscreenButton,
  VideoMuteButton,
  VideoPlayButton,
  VideoTimeDisplay,
  VideoTimeRange,
} from './Video';

const SAMPLE_VIDEO = 'https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4';
const SAMPLE_POSTER = 'https://image.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/thumbnail.webp';
const SAMPLE_PORTRAIT_VIDEO = 'https://stream.mux.com/1EFcsL5JET00t00mBv01t00xt00T4QeNQtsXx2cKY6DLd7RM/high.mp4';
const SAMPLE_PORTRAIT_POSTER = 'https://image.mux.com/1EFcsL5JET00t00mBv01t00xt00T4QeNQtsXx2cKY6DLd7RM/thumbnail.jpg';
const SAMPLE_PORTRAIT_THUMBNAILS =
  'https://image.mux.com/1EFcsL5JET00t00mBv01t00xt00T4QeNQtsXx2cKY6DLd7RM/storyboard.vtt';
const SAMPLE_CAPTIONS = 'https://media-chrome.mux.dev/examples/vanilla/vtt/en-cc.vtt';
const SAMPLE_THUMBNAILS = 'https://image.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/storyboard.vtt';
const SAMPLE_CHAPTERS = `data:text/vtt;charset=utf-8,${encodeURIComponent(`WEBVTT

00:00:00.000 --> 00:00:08.000
Introduction

00:00:08.000 --> 00:00:18.000
The landscape

00:00:18.000 --> 00:00:30.000
Closing scene`)}`;

const meta = {
  title: 'Components/Video',
  component: Video,
  args: {
    src: SAMPLE_VIDEO,
    poster: SAMPLE_POSTER,
    mediaProps: {
      crossOrigin: 'anonymous',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A Frost-themed video player powered by Media Chrome. Import it from \`@ebuckleyk/frost-ui/components/Video\` and pass standard media behavior through \`mediaProps\`.

Install the optional peer with \`npm i media-chrome\`. Tailwind v4 apps should also import \`@ebuckleyk/frost-ui/tailwind.css\`; compiled-CSS consumers can import \`@ebuckleyk/frost-ui/styles.css\`.

\`Video\` includes responsive controls, keyboard shortcuts, click/tap gestures, loading feedback, picture-in-picture, captions, playback speed, and fullscreen. Use \`VideoAdvancedControls\` for seek buttons, settings menus, casting, AirPlay, and error feedback.

Text tracks use standard WebVTT files. The \`captions\`, \`chapters\`, and \`thumbnails\` props provide concise typed helpers, while \`tracks\` and the exported compound components cover custom compositions.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[min(56rem,calc(100vw-2rem))]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default player includes responsive on-demand controls and inherits Frost theme tokens.',
      },
      source: {
        language: 'tsx',
        code: `import { Video } from '@ebuckleyk/frost-ui/components/Video';

export function ProductVideo() {
  return (
    <Video
      src="/videos/product-tour.mp4"
      poster="/videos/product-tour.webp"
      mediaProps={{ playsInline: true }}
    />
  );
}`,
      },
    },
  },
};

export const WithCaptions: Story = {
  args: {
    captions: [{ default: true, label: 'English', src: SAMPLE_CAPTIONS, srcLang: 'en' }],
    chapters: [{ default: true, label: 'Chapters', src: SAMPLE_CHAPTERS, srcLang: 'en' }],
    thumbnails: { src: SAMPLE_THUMBNAILS },
    mediaProps: {
      'aria-label': 'A sample landscape video',
      crossOrigin: 'anonymous',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Captions, chapter segments, and timeline storyboard previews use typed WebVTT track props.',
      },
      source: {
        language: 'tsx',
        code: `import { Video } from '@ebuckleyk/frost-ui/components/Video';

<Video
  src="/videos/product-tour.mp4"
  captions={[
    { src: '/captions/en.vtt', srcLang: 'en', label: 'English', default: true },
    { src: '/captions/es.vtt', srcLang: 'es', label: 'Español' },
  ]}
  chapters={[{ src: '/chapters.vtt', srcLang: 'en', label: 'Chapters', default: true }]}
  thumbnails={{ src: '/storyboard.vtt' }}
/>`,
      },
    },
  },
};

export const AdvancedControls: Story = {
  args: {
    captions: [{ default: true, label: 'English', src: SAMPLE_CAPTIONS, srcLang: 'en' }],
    chapters: [{ default: true, label: 'Chapters', src: SAMPLE_CHAPTERS, srcLang: 'en' }],
    controls: <VideoAdvancedControls seekBackwardOffset={5} seekForwardOffset={15} />,
    defaultSubtitles: true,
    keyboardBackwardSeekOffset: 5,
    keyboardForwardSeekOffset: 15,
    thumbnails: { src: SAMPLE_THUMBNAILS },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Adds seek controls, a settings menu for speed/quality/captions/audio, error feedback, AirPlay, and casting. Unavailable platform controls hide themselves.',
      },
      source: {
        language: 'tsx',
        code: `import { Video, VideoAdvancedControls } from '@ebuckleyk/frost-ui/components/Video';

<Video
  src="/videos/movie.mp4"
  defaultSubtitles
  keyboardBackwardSeekOffset={5}
  keyboardForwardSeekOffset={15}
  controls={<VideoAdvancedControls seekBackwardOffset={5} seekForwardOffset={15} />}
/>`,
      },
    },
  },
};

export const CustomControls: Story = {
  args: {
    controls: (
      <VideoControls>
        <VideoTimeRange className="order-first h-4 w-full basis-full" />
        <VideoPlayButton />
        <VideoMuteButton />
        <VideoTimeDisplay showDuration />
        <span aria-hidden="true" className="flex-1" />
        <VideoFullscreenButton />
      </VideoControls>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Compose a smaller control set using only Frost UI exports.',
      },
      source: {
        language: 'tsx',
        code: `import {
  Video,
  VideoControls,
  VideoFullscreenButton,
  VideoMuteButton,
  VideoPlayButton,
  VideoTimeDisplay,
  VideoTimeRange,
} from '@ebuckleyk/frost-ui/components/Video';

<Video
  src="/videos/demo.mp4"
  controls={
    <VideoControls>
      <VideoTimeRange className="order-first h-4 w-full basis-full" />
      <VideoPlayButton />
      <VideoMuteButton />
      <VideoTimeDisplay showDuration />
      <span aria-hidden className="flex-1" />
      <VideoFullscreenButton />
    </VideoControls>
  }
/>`,
      },
    },
  },
};

export const Portrait: Story = {
  args: {
    className: 'mx-auto aspect-[9/16] max-w-sm',
    controls: (
      <VideoControls className="flex-nowrap gap-1 bg-black/70 px-2 py-2">
        <VideoPlayButton />
        <VideoMuteButton />
        <VideoTimeRange className="min-w-0 flex-1 [--media-range-padding:0.5rem]" />
        <VideoTimeDisplay remaining />
        <VideoFullscreenButton />
      </VideoControls>
    ),
    mediaProps: {
      crossOrigin: 'anonymous',
      muted: true,
      playsInline: true,
    },
    poster: SAMPLE_PORTRAIT_POSTER,
    src: SAMPLE_PORTRAIT_VIDEO,
    thumbnails: { src: SAMPLE_PORTRAIT_THUMBNAILS },
  },
  parameters: {
    docs: {
      description: {
        story: 'A true 9:16 source with a compact single-row control bar, matching Media Chrome’s portrait pattern.',
      },
      source: {
        language: 'tsx',
        code: `import {
  Video,
  VideoControls,
  VideoFullscreenButton,
  VideoMuteButton,
  VideoPlayButton,
  VideoTimeDisplay,
  VideoTimeRange,
} from '@ebuckleyk/frost-ui/components/Video';

<Video
  className="aspect-[9/16] max-w-sm"
  src="/videos/portrait.mp4"
  poster="/videos/portrait.webp"
  mediaProps={{ muted: true, playsInline: true }}
  controls={
    <VideoControls className="flex-nowrap gap-1 bg-black/70 px-2 py-2">
      <VideoPlayButton />
      <VideoMuteButton />
      <VideoTimeRange className="min-w-0 flex-1" />
      <VideoTimeDisplay remaining />
      <VideoFullscreenButton />
    </VideoControls>
  }
/>`,
      },
    },
  },
};

export const Responsive: Story = {
  args: {
    className: 'max-w-md',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The control bar responds to the player container, so the same component works in cards, sidebars, and full-width layouts.',
      },
      source: {
        language: 'tsx',
        code: `import { Video } from '@ebuckleyk/frost-ui/components/Video';

<Video className="max-w-md" src="/videos/demo.mp4" />`,
      },
    },
  },
};

export const NoControls: Story = {
  args: {
    controls: false,
    mediaProps: {
      autoPlay: true,
      crossOrigin: 'anonymous',
      loop: true,
      muted: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Disable chrome entirely for ambient, decorative, or externally controlled media.',
      },
      source: {
        language: 'tsx',
        code: `import { Video } from '@ebuckleyk/frost-ui/components/Video';

<Video
  src="/videos/ambient.mp4"
  controls={false}
  mediaProps={{ autoPlay: true, loop: true, muted: true, playsInline: true }}
/>`,
      },
    },
  },
};

export const KnownDurationWithoutPreload: Story = {
  args: {
    defaultDuration: 134,
    mediaProps: {
      crossOrigin: 'anonymous',
      preload: 'none',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Show a known duration while avoiding media preload and preserving the player layout.',
      },
      source: {
        language: 'tsx',
        code: `import { Video } from '@ebuckleyk/frost-ui/components/Video';

<Video
  src="/videos/feature.mp4"
  poster="/videos/feature.webp"
  defaultDuration={134}
  mediaProps={{ preload: 'none' }}
/>`,
      },
    },
  },
};

export const AutoplayMuted: Story = {
  args: {
    mediaProps: {
      autoPlay: true,
      crossOrigin: 'anonymous',
      loop: true,
      muted: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Browser-compatible autoplay requires muted inline playback.',
      },
      source: {
        language: 'tsx',
        code: `import { Video } from '@ebuckleyk/frost-ui/components/Video';

<Video
  src="/videos/ambient.mp4"
  mediaProps={{ autoPlay: true, loop: true, muted: true, playsInline: true }}
/>`,
      },
    },
  },
};
