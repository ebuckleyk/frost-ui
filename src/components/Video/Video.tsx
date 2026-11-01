'use client';

import * as React from 'react';
import {
  MediaAirplayButton,
  MediaCaptionsButton,
  MediaCastButton,
  MediaControlBar,
  MediaController,
  MediaErrorDialog,
  MediaFullscreenButton,
  MediaLiveButton,
  MediaLoadingIndicator,
  MediaLoopButton,
  MediaMuteButton,
  MediaPipButton,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from 'media-chrome/react';
import {
  MediaAudioTrackMenu,
  MediaCaptionsMenu,
  MediaPlaybackRateMenu,
  MediaRenditionMenu,
  MediaSettingsMenu,
  MediaSettingsMenuButton,
  MediaSettingsMenuItem,
} from 'media-chrome/react/menu';

import { cn } from '@/lib/utils';

import { LabeledControl, mediaThemeClassName } from './mediaShared';

type VideoMediaProps = Omit<React.ComponentProps<'video'>, 'children' | 'controls' | 'poster' | 'src'>;

type VideoSourceProps = React.ComponentProps<'source'> & { src: string };
type VideoTrackProps = React.ComponentProps<'track'> & { src: string };
type VideoCaptionTrackProps = Omit<VideoTrackProps, 'kind'> & {
  kind?: 'captions' | 'subtitles';
  label: string;
  srcLang: string;
};
type VideoChapterTrackProps = Omit<VideoTrackProps, 'kind'>;
type VideoThumbnailTrackProps = Omit<VideoTrackProps, 'kind' | 'label'> & { label?: string };

type VideoProps = Omit<React.ComponentProps<typeof MediaController>, 'children'> & {
  /** A media URL. Omit this when supplying `<source>` elements as children. */
  src?: string;
  /** An image shown before playback begins. */
  poster?: string;
  /** Props applied to the underlying native video element. */
  mediaProps?: VideoMediaProps;
  /** A ref to the underlying native video element. */
  mediaRef?: React.Ref<HTMLVideoElement>;
  /** Alternate media files, ordered by preference. */
  sources?: VideoSourceProps[];
  /** Caption or subtitle WebVTT tracks. */
  captions?: VideoCaptionTrackProps[];
  /** A chapter WebVTT track, used to segment and label the timeline. */
  chapters?: VideoChapterTrackProps[];
  /** A storyboard WebVTT track used for timeline thumbnail previews. */
  thumbnails?: VideoThumbnailTrackProps;
  /** Additional native text tracks such as descriptions or metadata. */
  tracks?: VideoTrackProps[];
  /** Track and source elements rendered inside the native video element. */
  children?: React.ReactNode;
  /** Replace the default control bar, or pass `false` to render no controls. */
  controls?: React.ReactNode | false;
  /** Overrides for the default control text. Custom `controls` take their own `labels`. */
  labels?: VideoControlLabels;
};

/** Each label replaces both the control's accessible name and its tooltip. */
type VideoControlLabels = {
  playbackProgress?: string;
  playPause?: string;
  muteUnmute?: string;
  volume?: string;
  toggleCaptions?: string;
  playbackSpeed?: string;
  pictureInPicture?: string;
  fullscreen?: string;
};
type VideoSettingsMenuLabels = {
  speed?: string;
  quality?: string;
  captions?: string;
  audio?: string;
};
type VideoAdvancedControlLabels = Omit<VideoControlLabels, 'toggleCaptions' | 'playbackSpeed'> &
  VideoSettingsMenuLabels & {
    seekBackward?: (seconds: number) => string;
    seekForward?: (seconds: number) => string;
    playbackSettings?: string;
    cast?: string;
    airplay?: string;
  };

type VideoControlsProps = React.ComponentProps<typeof MediaControlBar> & {
  /** Overrides for the default control text. Ignored when `children` are supplied. */
  labels?: VideoControlLabels;
};
type VideoAdvancedControlsProps = Omit<VideoControlsProps, 'labels'> & {
  seekBackwardOffset?: number;
  seekForwardOffset?: number;
  /** Overrides for the control and settings menu text. Control labels are ignored when `children` are supplied. */
  labels?: VideoAdvancedControlLabels;
};
type VideoSettingsMenuProps = React.ComponentProps<typeof MediaSettingsMenu> & {
  /** Overrides for the menu item and submenu title text. */
  labels?: VideoSettingsMenuLabels;
};

const VideoAirplayButton = MediaAirplayButton;
const VideoCaptionsButton = MediaCaptionsButton;
const VideoCastButton = MediaCastButton;
const VideoFullscreenButton = MediaFullscreenButton;
const VideoLiveButton = MediaLiveButton;
const VideoLoopButton = MediaLoopButton;
const VideoMuteButton = MediaMuteButton;
const VideoPipButton = MediaPipButton;
const VideoPlaybackRateButton = MediaPlaybackRateButton;
const VideoPlayButton = MediaPlayButton;
const VideoSeekBackwardButton = MediaSeekBackwardButton;
const VideoSeekForwardButton = MediaSeekForwardButton;
const VideoTimeDisplay = MediaTimeDisplay;
const VideoTimeRange = MediaTimeRange;
const VideoVolumeRange = MediaVolumeRange;

function VideoSource(props: VideoSourceProps) {
  return <source {...props} />;
}

function VideoTrack(props: VideoTrackProps) {
  return <track {...props} />;
}

function VideoCaptionTrack({ kind = 'captions', ...props }: VideoCaptionTrackProps) {
  return <VideoTrack kind={kind} {...props} />;
}

function VideoChapterTrack({ default: defaultTrack, ...props }: VideoChapterTrackProps) {
  return <VideoTrack default={defaultTrack} kind="chapters" {...props} />;
}

function VideoThumbnailTrack({
  default: defaultTrack = true,
  label = 'thumbnails',
  ...props
}: VideoThumbnailTrackProps) {
  return <VideoTrack default={defaultTrack} kind="metadata" label={label} {...props} />;
}

function VideoControls({ children, className, labels, ...props }: VideoControlsProps) {
  return (
    <MediaControlBar
      data-slot="video-controls"
      className={cn(
        `
          absolute inset-x-0 bottom-0 z-10 flex w-full flex-wrap items-center
          gap-x-0.5 gap-y-1 bg-linear-to-t from-black/95 via-black/70
          to-transparent px-2 pt-10 pb-2
        `,
        className,
      )}
      {...props}
    >
      {children ?? <DefaultControlItems labels={labels} />}
    </MediaControlBar>
  );
}

function VideoSettingsMenu({ className, labels, ...props }: VideoSettingsMenuProps) {
  const { speed = 'Speed', quality = 'Quality', captions = 'Captions', audio = 'Audio' } = labels ?? {};

  return (
    <MediaSettingsMenu
      anchor="auto"
      hidden
      className={cn(
        `
          z-20 min-w-44 -translate-y-6 border border-white/15 shadow-xl
          backdrop-blur-xl
          [--media-control-background:rgb(10_10_10/0.94)]
          [--media-menu-background:rgb(10_10_10/0.94)]
          [--media-menu-border-radius:0.75rem]
          [--media-menu-item-hover-background:color-mix(in_oklch,var(--accent)_42%,transparent)]
          [--media-menu-padding:0.5rem]
          [--media-primary-color:white]
          [--media-secondary-color:black]
          [&>media-settings-menu-item[submenusize='0']]:pointer-events-none
          [&>media-settings-menu-item[submenusize='0']]:opacity-50
        `,
        className,
      )}
      {...props}
    >
      <MediaSettingsMenuItem className="px-3">
        {speed}
        <MediaPlaybackRateMenu slot="submenu" hidden>
          <span slot="title">{speed}</span>
        </MediaPlaybackRateMenu>
      </MediaSettingsMenuItem>
      <MediaSettingsMenuItem className="px-3">
        {quality}
        <MediaRenditionMenu slot="submenu" hidden>
          <span slot="title">{quality}</span>
        </MediaRenditionMenu>
      </MediaSettingsMenuItem>
      <MediaSettingsMenuItem className="px-3">
        {captions}
        <MediaCaptionsMenu slot="submenu" hidden>
          <span slot="title">{captions}</span>
        </MediaCaptionsMenu>
      </MediaSettingsMenuItem>
      <MediaSettingsMenuItem className="px-3">
        {audio}
        <MediaAudioTrackMenu slot="submenu" hidden>
          <span slot="title">{audio}</span>
        </MediaAudioTrackMenu>
      </MediaSettingsMenuItem>
    </MediaSettingsMenu>
  );
}

function VideoAdvancedControls({
  children,
  labels,
  seekBackwardOffset = 5,
  seekForwardOffset = 15,
  ...props
}: VideoAdvancedControlsProps) {
  return (
    <>
      <MediaErrorDialog slot="dialog" />
      <VideoSettingsMenu labels={labels} />
      <VideoControls {...props}>
        {children ?? (
          <>
            <LabeledControl
              as={VideoTimeRange}
              defaultLabel="Playback progress"
              label={labels?.playbackProgress}
              tooltip={false}
              className="order-first mb-1 h-5 w-full basis-full [--media-range-padding:0.625rem]"
            />
            <LabeledControl as={VideoPlayButton} defaultLabel="Play or pause" label={labels?.playPause} />
            <LabeledControl
              as={VideoSeekBackwardButton}
              defaultLabel={`Seek backward ${seekBackwardOffset} seconds`}
              label={labels?.seekBackward?.(seekBackwardOffset)}
              seekOffset={seekBackwardOffset}
            />
            <LabeledControl
              as={VideoSeekForwardButton}
              defaultLabel={`Seek forward ${seekForwardOffset} seconds`}
              label={labels?.seekForward?.(seekForwardOffset)}
              seekOffset={seekForwardOffset}
            />
            <LabeledControl as={VideoMuteButton} defaultLabel="Mute or unmute" label={labels?.muteUnmute} />
            <LabeledControl
              as={VideoVolumeRange}
              defaultLabel="Volume"
              label={labels?.volume}
              tooltip={false}
              className="mr-1 hidden w-20 shrink-0 in-[[breakpointlg]]:inline-block"
            />
            <VideoTimeDisplay showDuration className="inline-flex shrink-0 whitespace-nowrap" />
            <span aria-hidden="true" className="min-w-2 flex-1" />
            <LabeledControl
              as={MediaSettingsMenuButton}
              defaultLabel="Playback settings"
              label={labels?.playbackSettings}
            />
            <LabeledControl
              as={VideoPipButton}
              defaultLabel="Picture in picture"
              label={labels?.pictureInPicture}
              className="hidden in-[[breakpointsm]]:inline-flex"
            />
            <LabeledControl
              as={VideoCastButton}
              defaultLabel="Cast"
              label={labels?.cast}
              className="hidden in-[[breakpointmd]]:inline-flex"
            />
            <LabeledControl
              as={VideoAirplayButton}
              defaultLabel="AirPlay"
              label={labels?.airplay}
              className="hidden in-[[breakpointmd]]:inline-flex"
            />
            <LabeledControl
              as={VideoFullscreenButton}
              defaultLabel="Enter or exit fullscreen"
              label={labels?.fullscreen}
            />
          </>
        )}
      </VideoControls>
    </>
  );
}

function DefaultControlItems({ labels }: { labels?: VideoControlLabels }) {
  return (
    <>
      <LabeledControl
        as={VideoTimeRange}
        defaultLabel="Playback progress"
        label={labels?.playbackProgress}
        tooltip={false}
        className="order-first mb-1 h-5 w-full basis-full [--media-range-padding:0.625rem]"
      />
      <LabeledControl as={VideoPlayButton} defaultLabel="Play or pause" label={labels?.playPause} />
      <LabeledControl as={VideoMuteButton} defaultLabel="Mute or unmute" label={labels?.muteUnmute} />
      <LabeledControl
        as={VideoVolumeRange}
        defaultLabel="Volume"
        label={labels?.volume}
        tooltip={false}
        className="mx-2 hidden w-20 shrink-0 in-[[breakpointmd]]:inline-block"
      />
      <VideoTimeDisplay showDuration className="inline-flex shrink-0 whitespace-nowrap" />
      <span aria-hidden="true" className="min-w-2 flex-1" />
      <LabeledControl as={VideoCaptionsButton} defaultLabel="Toggle captions" label={labels?.toggleCaptions} />
      <LabeledControl
        as={VideoPlaybackRateButton}
        defaultLabel="Playback speed"
        label={labels?.playbackSpeed}
        className="hidden in-[[breakpointsm]]:inline-flex"
      />
      <LabeledControl
        as={VideoPipButton}
        defaultLabel="Picture in picture"
        label={labels?.pictureInPicture}
        className="hidden in-[[breakpointsm]]:inline-flex"
      />
      <LabeledControl as={VideoFullscreenButton} defaultLabel="Enter or exit fullscreen" label={labels?.fullscreen} />
    </>
  );
}

function Video({
  children,
  captions,
  chapters,
  className,
  controls,
  labels,
  mediaProps,
  mediaRef,
  poster,
  sources,
  src,
  thumbnails,
  tracks,
  ...props
}: VideoProps) {
  const { className: mediaClassName, preload = 'metadata', ...videoProps } = mediaProps ?? {};

  return (
    <MediaController
      data-slot="video"
      className={cn(
        `
          relative aspect-video w-full overflow-hidden rounded-xl border
          border-white/15 bg-black shadow-sm
        `,
        mediaThemeClassName,
        className,
      )}
      {...props}
    >
      <video
        ref={mediaRef}
        slot="media"
        src={src}
        poster={poster}
        preload={preload}
        className={cn('size-full object-cover', mediaClassName)}
        {...videoProps}
      >
        {sources?.map((source, index) => (
          <VideoSource key={`${source.src}:${source.type ?? index}`} {...source} />
        ))}
        {captions?.map((caption, index) => (
          <VideoCaptionTrack key={`${caption.src}:${caption.srcLang}:${index}`} {...caption} />
        ))}
        {chapters?.map((chapter, index) => (
          <VideoChapterTrack key={`${chapter.src}:${chapter.srcLang ?? index}`} {...chapter} />
        ))}
        {thumbnails ? <VideoThumbnailTrack {...thumbnails} /> : null}
        {tracks?.map((track, index) => (
          <VideoTrack key={`${track.src}:${track.kind ?? index}`} {...track} />
        ))}
        {children}
      </video>
      <MediaLoadingIndicator data-slot="video-loading-indicator" />
      {controls === undefined ? <VideoControls labels={labels} /> : controls}
    </MediaController>
  );
}

export {
  Video,
  VideoAdvancedControls,
  VideoAirplayButton,
  VideoCaptionTrack,
  VideoCaptionsButton,
  VideoCastButton,
  VideoChapterTrack,
  VideoControls,
  VideoFullscreenButton,
  VideoLiveButton,
  VideoLoopButton,
  VideoMuteButton,
  VideoPipButton,
  VideoPlaybackRateButton,
  VideoPlayButton,
  VideoSeekBackwardButton,
  VideoSeekForwardButton,
  VideoSettingsMenu,
  VideoSource,
  VideoThumbnailTrack,
  VideoTimeDisplay,
  VideoTimeRange,
  VideoTrack,
  VideoVolumeRange,
  type VideoAdvancedControlLabels,
  type VideoAdvancedControlsProps,
  type VideoCaptionTrackProps,
  type VideoChapterTrackProps,
  type VideoControlLabels,
  type VideoControlsProps,
  type VideoMediaProps,
  type VideoProps,
  type VideoSourceProps,
  type VideoSettingsMenuLabels,
  type VideoSettingsMenuProps,
  type VideoThumbnailTrackProps,
  type VideoTrackProps,
};
