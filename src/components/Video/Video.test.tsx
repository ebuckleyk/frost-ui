import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { Video, VideoAdvancedControls, VideoControls, VideoPlayButton } from './Video';

const mediaTrackList = Object.assign(new EventTarget(), {
  length: 0,
  getTrackById: () => null,
  [Symbol.iterator]: function* () {},
});
const elementParts = new WeakMap<HTMLElement, DOMTokenList>();

Object.defineProperty(HTMLElement.prototype, 'part', {
  configurable: true,
  get() {
    let part = elementParts.get(this);
    if (!part) {
      part = document.createElement('span').classList;
      elementParts.set(this, part);
    }
    return part;
  },
});

for (const property of ['audioTracks', 'textTracks', 'videoRenditions']) {
  Object.defineProperty(HTMLMediaElement.prototype, property, {
    configurable: true,
    get: () => mediaTrackList,
  });
}

describe('Video', () => {
  it('renders a native video with Frost UI controls', () => {
    const mediaRef = React.createRef<HTMLVideoElement>();
    const { container } = render(
      <Video
        src="video.mp4"
        poster="poster.jpg"
        mediaRef={mediaRef}
        mediaProps={{ 'aria-label': 'Product tour', muted: true }}
        sources={[{ src: 'video.webm', type: 'video/webm' }]}
        captions={[{ default: true, label: 'English', src: 'captions.vtt', srcLang: 'en' }]}
        chapters={[
          { default: true, label: 'English chapters', src: 'chapters-en.vtt', srcLang: 'en' },
          { label: 'Spanish chapters', src: 'chapters-es.vtt', srcLang: 'es' },
        ]}
        thumbnails={{ src: 'storyboard.vtt' }}
        tracks={[{ kind: 'descriptions', label: 'Descriptions', src: 'descriptions.vtt', srcLang: 'en' }]}
      />,
    );

    const video = screen.getByLabelText('Product tour');
    expect(video).toHaveAttribute('slot', 'media');
    expect(video).toHaveAttribute('src', 'video.mp4');
    expect(video).toHaveAttribute('poster', 'poster.jpg');
    expect(video).toHaveAttribute('preload', 'metadata');
    expect(video).toHaveProperty('muted', true);
    expect(mediaRef.current).toBe(video);
    expect(container.querySelector('[data-slot="video-controls"]')).toBeInTheDocument();
    expect(video.querySelector('source')).toHaveAttribute('src', 'video.webm');
    expect(video.querySelector('track[kind="captions"]')).toHaveAttribute('src', 'captions.vtt');
    const chapterTracks = video.querySelectorAll('track[kind="chapters"]');
    expect(chapterTracks).toHaveLength(2);
    expect(chapterTracks[0]).toHaveAttribute('src', 'chapters-en.vtt');
    expect(chapterTracks[0]).toHaveAttribute('default');
    expect(chapterTracks[1]).toHaveAttribute('src', 'chapters-es.vtt');
    expect(chapterTracks[1]).not.toHaveAttribute('default');
    expect(video.querySelector('track[label="thumbnails"]')).toHaveAttribute('kind', 'metadata');
    expect(video.querySelector('track[kind="descriptions"]')).toHaveAttribute('src', 'descriptions.vtt');
  });

  it('supports custom and hidden controls', () => {
    const { container, rerender } = render(
      <Video
        src="video.mp4"
        controls={
          <VideoControls data-testid="custom-controls">
            <VideoPlayButton data-testid="custom-play" />
          </VideoControls>
        }
      />,
    );

    expect(screen.getByTestId('custom-controls')).toBeInTheDocument();
    expect(screen.getByTestId('custom-play')).toBeInTheDocument();

    rerender(<Video src="video.mp4" controls={false} />);
    expect(container.querySelector('[data-slot="video-controls"]')).not.toBeInTheDocument();
  });

  it('renders the advanced control preset', () => {
    const { container } = render(
      <Video src="video.mp4" controls={<VideoAdvancedControls seekBackwardOffset={5} seekForwardOffset={15} />} />,
    );

    expect(container.querySelector('media-error-dialog')).toBeInTheDocument();
    expect(container.querySelector('media-settings-menu')).toBeInTheDocument();
    expect(container.querySelector('media-settings-menu-button')).toBeInTheDocument();
    expect(container.querySelector('media-seek-backward-button')).toHaveAttribute('seekoffset', '5');
    expect(container.querySelector('media-seek-forward-button')).toHaveAttribute('seekoffset', '15');
    expect(container.querySelector('media-cast-button')).toBeInTheDocument();
    expect(container.querySelector('media-airplay-button')).toBeInTheDocument();
  });
});
