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
};

type VideoControlsProps = React.ComponentProps<typeof MediaControlBar>;
type VideoAdvancedControlsProps = VideoControlsProps & {
  seekBackwardOffset?: number;
  seekForwardOffset?: number;
};
type VideoSettingsMenuProps = React.ComponentProps<typeof MediaSettingsMenu>;

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

function VideoControls({ children, className, ...props }: VideoControlsProps) {
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
      {children ?? defaultControlItems}
    </MediaControlBar>
  );
}

function VideoSettingsMenu({ className, ...props }: VideoSettingsMenuProps) {
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
        Speed
        <MediaPlaybackRateMenu slot="submenu" hidden>
          <span slot="title">Speed</span>
        </MediaPlaybackRateMenu>
      </MediaSettingsMenuItem>
      <MediaSettingsMenuItem className="px-3">
        Quality
        <MediaRenditionMenu slot="submenu" hidden>
          <span slot="title">Quality</span>
        </MediaRenditionMenu>
      </MediaSettingsMenuItem>
      <MediaSettingsMenuItem className="px-3">
        Captions
        <MediaCaptionsMenu slot="submenu" hidden>
          <span slot="title">Captions</span>
        </MediaCaptionsMenu>
      </MediaSettingsMenuItem>
      <MediaSettingsMenuItem className="px-3">
        Audio
        <MediaAudioTrackMenu slot="submenu" hidden>
          <span slot="title">Audio</span>
        </MediaAudioTrackMenu>
      </MediaSettingsMenuItem>
    </MediaSettingsMenu>
  );
}

function VideoAdvancedControls({
  children,
  seekBackwardOffset = 5,
  seekForwardOffset = 15,
  ...props
}: VideoAdvancedControlsProps) {
  return (
    <>
      <MediaErrorDialog slot="dialog" />
      <VideoSettingsMenu />
      <VideoControls {...props}>
        {children ?? (
          <>
            <VideoTimeRange
              aria-label="Playback progress"
              className="order-first mb-1 h-5 w-full basis-full [--media-range-padding:0.625rem]"
            />
            <VideoPlayButton aria-label="Play or pause" />
            <VideoSeekBackwardButton
              aria-label={`Seek backward ${seekBackwardOffset} seconds`}
              seekOffset={seekBackwardOffset}
            />
            <VideoSeekForwardButton
              aria-label={`Seek forward ${seekForwardOffset} seconds`}
              seekOffset={seekForwardOffset}
            />
            <VideoMuteButton aria-label="Mute or unmute" />
            <VideoVolumeRange
              aria-label="Volume"
              className="mr-1 hidden w-20 shrink-0 in-[[breakpointlg]]:inline-block"
            />
            <VideoTimeDisplay showDuration className="inline-flex shrink-0 whitespace-nowrap" />
            <span aria-hidden="true" className="min-w-2 flex-1" />
            <MediaSettingsMenuButton aria-label="Playback settings" />
            <VideoPipButton aria-label="Picture in picture" className="hidden in-[[breakpointsm]]:inline-flex" />
            <VideoCastButton aria-label="Cast" className="hidden in-[[breakpointmd]]:inline-flex" />
            <VideoAirplayButton aria-label="AirPlay" className="hidden in-[[breakpointmd]]:inline-flex" />
            <VideoFullscreenButton aria-label="Enter or exit fullscreen" />
          </>
        )}
      </VideoControls>
    </>
  );
}

const defaultControlItems = (
  <>
    <VideoTimeRange
      aria-label="Playback progress"
      className="order-first mb-1 h-5 w-full basis-full [--media-range-padding:0.625rem]"
    />
    <VideoPlayButton aria-label="Play or pause" />
    <VideoMuteButton aria-label="Mute or unmute" />
    <VideoVolumeRange aria-label="Volume" className="mx-2 hidden w-20 shrink-0 in-[[breakpointmd]]:inline-block" />
    <VideoTimeDisplay showDuration className="inline-flex shrink-0 whitespace-nowrap" />
    <span aria-hidden="true" className="min-w-2 flex-1" />
    <VideoCaptionsButton aria-label="Toggle captions" />
    <VideoPlaybackRateButton aria-label="Playback speed" className="hidden in-[[breakpointsm]]:inline-flex" />
    <VideoPipButton aria-label="Picture in picture" className="hidden in-[[breakpointsm]]:inline-flex" />
    <VideoFullscreenButton aria-label="Enter or exit fullscreen" />
  </>
);

const defaultControls = <VideoControls />;

function Video({
  children,
  captions,
  chapters,
  className,
  controls = defaultControls,
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
          [--media-button-icon-height:1.5rem]
          [--media-control-background:transparent]
          [--media-control-height:1.5rem]
          [--media-control-hover-background:color-mix(in_oklch,var(--accent)_32%,transparent)]
          [--media-control-padding:0.625rem]
          [--media-focus-box-shadow:inset_0_0_0_2px_var(--primary)]
          [--media-font-family:inherit]
          [--media-font-size:0.75rem]
          [--media-font-weight:500]
          [--media-primary-color:var(--primary-foreground)]
          [--media-range-bar-color:var(--primary)]
          [--media-range-thumb-background:var(--primary)]
          [--media-range-thumb-box-shadow:0_0_0_3px_color-mix(in_oklch,var(--primary)_24%,transparent)]
          [--media-range-thumb-height:0.75rem]
          [--media-range-thumb-width:0.75rem]
          [--media-range-track-background:color-mix(in_oklch,var(--primary-foreground)_28%,transparent)]
          [--media-range-track-border-radius:9999px]
          [--media-range-track-height:0.25rem]
          [--media-secondary-color:color-mix(in_oklch,var(--background)_72%,transparent)]
        `,
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
      {controls}
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
  type VideoAdvancedControlsProps,
  type VideoCaptionTrackProps,
  type VideoChapterTrackProps,
  type VideoControlsProps,
  type VideoMediaProps,
  type VideoProps,
  type VideoSourceProps,
  type VideoSettingsMenuProps,
  type VideoThumbnailTrackProps,
  type VideoTrackProps,
};
