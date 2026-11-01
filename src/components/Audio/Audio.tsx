'use client';

import * as React from 'react';
import { MediaControlBar, MediaController } from 'media-chrome/react';

import { cn } from '@/lib/utils';

import { LabeledControl, mediaThemeClassName } from '../Video/mediaShared';
import {
  VideoMuteButton as AudioMuteButton,
  VideoPlaybackRateButton as AudioPlaybackRateButton,
  VideoPlayButton as AudioPlayButton,
  VideoSeekBackwardButton as AudioSeekBackwardButton,
  VideoSeekForwardButton as AudioSeekForwardButton,
  VideoSource as AudioSource,
  VideoTimeDisplay as AudioTimeDisplay,
  VideoTimeRange as AudioTimeRange,
  VideoVolumeRange as AudioVolumeRange,
  type VideoAdvancedControlLabels,
  type VideoControlLabels,
  type VideoSourceProps,
} from '../Video/Video';

type AudioMediaProps = Omit<React.ComponentProps<'audio'>, 'children' | 'controls' | 'src'>;
type AudioSourceProps = VideoSourceProps;

/** Each label replaces both the control's accessible name and its tooltip. */
type AudioControlLabels = Pick<
  VideoControlLabels,
  'playbackProgress' | 'playPause' | 'muteUnmute' | 'volume' | 'playbackSpeed'
> &
  Pick<VideoAdvancedControlLabels, 'seekBackward' | 'seekForward'>;

type AudioControlsProps = React.ComponentProps<typeof MediaControlBar> & {
  seekBackwardOffset?: number;
  seekForwardOffset?: number;
  /** Overrides for the default control text. Ignored when `children` are supplied. */
  labels?: AudioControlLabels;
};

type AudioProps = Omit<React.ComponentProps<typeof MediaController>, 'audio' | 'children'> & {
  /** A media URL. Omit this when supplying `<source>` elements as children. */
  src?: string;
  /** An image shown beside the controls. */
  artwork?: string;
  /** Alternative text for `artwork`. Defaults to decorative. */
  artworkAlt?: string;
  /** Props applied to the underlying native audio element. */
  mediaProps?: AudioMediaProps;
  /** A ref to the underlying native audio element. */
  mediaRef?: React.Ref<HTMLAudioElement>;
  /** Alternate media files, ordered by preference. */
  sources?: AudioSourceProps[];
  /** Track and source elements rendered inside the native audio element. */
  children?: React.ReactNode;
  /** Replace the default control bar, or pass `false` to render no controls. */
  controls?: React.ReactNode | false;
  /** Overrides for the default control text. Custom `controls` take their own `labels`. */
  labels?: AudioControlLabels;
};

function AudioControls({
  children,
  className,
  labels,
  seekBackwardOffset = 5,
  seekForwardOffset = 15,
  ...props
}: AudioControlsProps) {
  return (
    <MediaControlBar
      data-slot="audio-controls"
      className={cn('flex w-full flex-wrap items-center gap-x-0.5 gap-y-1 p-2', className)}
      {...props}
    >
      {children ?? (
        <>
          <LabeledControl
            as={AudioTimeRange}
            defaultLabel="Playback progress"
            label={labels?.playbackProgress}
            tooltip={false}
            className="order-first mb-1 h-5 w-full basis-full [--media-range-padding:0.625rem]"
          />
          <LabeledControl as={AudioPlayButton} defaultLabel="Play or pause" label={labels?.playPause} />
          <LabeledControl
            as={AudioSeekBackwardButton}
            defaultLabel={`Seek backward ${seekBackwardOffset} seconds`}
            label={labels?.seekBackward?.(seekBackwardOffset)}
            seekOffset={seekBackwardOffset}
          />
          <LabeledControl
            as={AudioSeekForwardButton}
            defaultLabel={`Seek forward ${seekForwardOffset} seconds`}
            label={labels?.seekForward?.(seekForwardOffset)}
            seekOffset={seekForwardOffset}
          />
          <LabeledControl as={AudioMuteButton} defaultLabel="Mute or unmute" label={labels?.muteUnmute} />
          <LabeledControl
            as={AudioVolumeRange}
            defaultLabel="Volume"
            label={labels?.volume}
            tooltip={false}
            className="mx-2 hidden w-20 shrink-0 in-[[breakpointmd]]:inline-block"
          />
          <AudioTimeDisplay showDuration className="inline-flex shrink-0 whitespace-nowrap" />
          <span aria-hidden="true" className="min-w-2 flex-1" />
          <LabeledControl as={AudioPlaybackRateButton} defaultLabel="Playback speed" label={labels?.playbackSpeed} />
        </>
      )}
    </MediaControlBar>
  );
}

function Audio({
  artwork,
  artworkAlt = '',
  children,
  className,
  controls,
  labels,
  mediaProps,
  mediaRef,
  sources,
  src,
  ...props
}: AudioProps) {
  const { preload = 'metadata', ...audioProps } = mediaProps ?? {};

  return (
    <div
      data-slot="audio"
      className={cn(
        `
          flex w-full items-center gap-2 rounded-xl border border-white/15
          bg-black shadow-sm
        `,
        mediaThemeClassName,
        className,
      )}
    >
      {artwork ? (
        <img
          data-slot="audio-artwork"
          src={artwork}
          alt={artworkAlt}
          className="ml-2 size-16 shrink-0 rounded-lg object-cover"
        />
      ) : null}
      <MediaController audio className="block min-w-0 flex-1 rounded-xl bg-transparent" {...props}>
        <audio ref={mediaRef} slot="media" src={src} preload={preload} {...audioProps}>
          {sources?.map((source, index) => (
            <AudioSource key={`${source.src}:${source.type ?? index}`} {...source} />
          ))}
          {children}
        </audio>
        {controls === undefined ? <AudioControls labels={labels} /> : controls}
      </MediaController>
    </div>
  );
}

export {
  Audio,
  AudioControls,
  AudioMuteButton,
  AudioPlaybackRateButton,
  AudioPlayButton,
  AudioSeekBackwardButton,
  AudioSeekForwardButton,
  AudioSource,
  AudioTimeDisplay,
  AudioTimeRange,
  AudioVolumeRange,
  type AudioControlLabels,
  type AudioControlsProps,
  type AudioMediaProps,
  type AudioProps,
  type AudioSourceProps,
};
