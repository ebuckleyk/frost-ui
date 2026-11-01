import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { Audio, AudioControls, AudioPlayButton } from './Audio';

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

describe('Audio', () => {
  it('renders a native audio element in audio mode with the shared controls', () => {
    const mediaRef = React.createRef<HTMLAudioElement>();
    const { container } = render(
      <Audio
        src="episode.mp3"
        mediaRef={mediaRef}
        mediaProps={{ 'aria-label': 'Episode 1', muted: true }}
        sources={[{ src: 'episode.ogg', type: 'audio/ogg' }]}
      />,
    );

    const audio = screen.getByLabelText('Episode 1');
    expect(audio.tagName).toBe('AUDIO');
    expect(audio).toHaveAttribute('slot', 'media');
    expect(audio).toHaveAttribute('src', 'episode.mp3');
    expect(audio).toHaveAttribute('preload', 'metadata');
    expect(audio).toHaveProperty('muted', true);
    expect(mediaRef.current).toBe(audio);
    expect(audio.querySelector('source')).toHaveAttribute('src', 'episode.ogg');
    expect(container.querySelector('video')).not.toBeInTheDocument();
    expect(container.querySelector('media-controller')).toHaveAttribute('audio');
    expect(container.querySelector('[data-slot="audio"]')).not.toHaveClass('aspect-video');

    for (const control of [
      'media-play-button',
      'media-seek-backward-button',
      'media-seek-forward-button',
      'media-time-range',
      'media-time-display',
      'media-playback-rate-button',
    ]) {
      expect(container.querySelector(control)).toBeInTheDocument();
    }
  });

  it('renders optional artwork', () => {
    const { container, rerender } = render(<Audio src="episode.mp3" />);
    expect(container.querySelector('[data-slot="audio-artwork"]')).not.toBeInTheDocument();

    rerender(<Audio src="episode.mp3" artwork="cover.jpg" artworkAlt="Show cover" />);
    expect(screen.getByAltText('Show cover')).toHaveAttribute('src', 'cover.jpg');
  });

  it('supports custom and hidden controls', () => {
    const { container, rerender } = render(
      <Audio
        src="episode.mp3"
        controls={
          <AudioControls data-testid="custom-controls">
            <AudioPlayButton data-testid="custom-play" />
          </AudioControls>
        }
      />,
    );
    expect(screen.getByTestId('custom-play')).toBeInTheDocument();

    rerender(<Audio src="episode.mp3" controls={false} />);
    expect(container.querySelector('[data-slot="audio-controls"]')).not.toBeInTheDocument();
  });

  it('applies label overrides, including offset-aware seek labels', async () => {
    const { container } = render(
      <Audio
        src="episode.mp3"
        controls={
          <AudioControls
            seekForwardOffset={30}
            labels={{ playPause: 'Reproducir o pausar', seekForward: (seconds) => `Avanzar ${seconds} segundos` }}
          />
        }
      />,
    );

    await waitFor(() => {
      expect(container.querySelector('media-play-button')).toHaveAttribute('aria-label', 'Reproducir o pausar');
      expect(container.querySelector('media-seek-forward-button')).toHaveAttribute('aria-label', 'Avanzar 30 segundos');
    });
  });
});
