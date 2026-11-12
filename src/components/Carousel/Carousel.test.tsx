import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Card, CardContent } from '../Card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from './Carousel';

class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];

  disconnect() {
    return null;
  }

  observe() {
    return null;
  }

  takeRecords() {
    return [];
  }

  unobserve() {
    return null;
  }
}

window.IntersectionObserver = IntersectionObserver;
global.IntersectionObserver = IntersectionObserver;

const Component = () => {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full max-w-sm"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="
              md:basis-1/2
              lg:basis-1/3
            "
          >
            <div className="p-1">
              <Card>
                <CardContent
                  className="
                  flex aspect-square items-center justify-center p-6
                "
                >
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

describe('Carousel', () => {
  it('should render Carousel component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});

type KeyboardHarnessProps = {
  orientation?: 'horizontal' | 'vertical';
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
};

async function renderKeyboardCarousel({ orientation, onKeyDown }: KeyboardHarnessProps = {}) {
  let api: NonNullable<CarouselApi> | undefined;
  const setApi = (next: CarouselApi) => {
    if (!next) return;
    api = next;
    vi.spyOn(next, 'scrollPrev');
    vi.spyOn(next, 'scrollNext');
  };

  render(
    <Carousel orientation={orientation} setApi={setApi} onKeyDown={onKeyDown} tabIndex={0} aria-label="Gallery">
      <CarouselContent>
        <CarouselItem>
          <input aria-label="Name" defaultValue="abcdef" />
        </CarouselItem>
        <CarouselItem>
          <textarea aria-label="Notes" defaultValue="abcdef" />
        </CarouselItem>
        <CarouselItem>
          <div aria-label="Editor" contentEditable suppressContentEditableWarning>
            <p>
              <strong data-testid="editor-nested">abcdef</strong>
            </p>
          </div>
        </CarouselItem>
        <CarouselItem>
          <label>
            <span>Wrapped</span>
            <input aria-label="Wrapped input" defaultValue="abcdef" />
          </label>
          <div role="slider" aria-label="Volume" aria-valuenow={5} tabIndex={0} />
          <div role="listbox" aria-label="Fruit">
            <div role="option" aria-selected="false" tabIndex={0} data-testid="listbox-option">
              Apple
            </div>
          </div>
          <select aria-label="Size" defaultValue="m">
            <option value="s">S</option>
            <option value="m">M</option>
          </select>
          <button type="button" data-testid="slide-button">
            Slide action
          </button>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>,
  );

  await waitFor(() => expect(api).toBeDefined());
  return api!;
}

describe('Carousel keyboard navigation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const editableTargets: Array<[string, () => HTMLElement]> = [
    ['input', () => screen.getByLabelText('Name')],
    ['textarea', () => screen.getByLabelText('Notes')],
    ['contenteditable', () => screen.getByLabelText('Editor')],
    ['element nested inside contenteditable', () => screen.getByTestId('editor-nested')],
    ['input nested inside a label', () => screen.getByLabelText('Wrapped input')],
    ['select', () => screen.getByLabelText('Size')],
    ['role="slider" control', () => screen.getByRole('slider')],
    ['option nested inside role="listbox"', () => screen.getByTestId('listbox-option')],
  ];

  const keys: Array<[string, { key: string; shiftKey?: boolean }]> = [
    ['ArrowLeft', { key: 'ArrowLeft' }],
    ['ArrowRight', { key: 'ArrowRight' }],
    ['Shift+ArrowLeft', { key: 'ArrowLeft', shiftKey: true }],
    ['Shift+ArrowRight', { key: 'ArrowRight', shiftKey: true }],
  ];

  describe.each(editableTargets)('inside a descendant %s', (_name, getTarget) => {
    it.each(keys)('leaves %s to the control', async (_label, init) => {
      const api = await renderKeyboardCarousel();
      const target = getTarget();
      target.focus();

      const notPrevented = fireEvent.keyDown(target, init);

      expect(notPrevented).toBe(true);
      expect(api.scrollPrev).not.toHaveBeenCalled();
      expect(api.scrollNext).not.toHaveBeenCalled();
    });
  });

  it('navigates when the carousel region itself has focus', async () => {
    const api = await renderKeyboardCarousel();
    const region = screen.getByRole('region', { name: 'Gallery' });
    region.focus();

    expect(fireEvent.keyDown(region, { key: 'ArrowRight' })).toBe(false);
    expect(api.scrollNext).toHaveBeenCalledTimes(1);

    expect(fireEvent.keyDown(region, { key: 'ArrowLeft' })).toBe(false);
    expect(api.scrollPrev).toHaveBeenCalledTimes(1);
  });

  it('navigates from the previous/next buttons and non-editable slide content', async () => {
    const api = await renderKeyboardCarousel();

    expect(fireEvent.keyDown(screen.getByRole('button', { name: 'Next slide' }), { key: 'ArrowRight' })).toBe(false);
    expect(fireEvent.keyDown(screen.getByTestId('slide-button'), { key: 'ArrowLeft' })).toBe(false);

    expect(api.scrollNext).toHaveBeenCalledTimes(1);
    expect(api.scrollPrev).toHaveBeenCalledTimes(1);
  });

  it('does not navigate with modifier keys held on the carousel itself', async () => {
    const api = await renderKeyboardCarousel();
    const region = screen.getByRole('region', { name: 'Gallery' });

    for (const modifier of ['shiftKey', 'altKey', 'ctrlKey', 'metaKey'] as const) {
      expect(fireEvent.keyDown(region, { key: 'ArrowLeft', [modifier]: true })).toBe(true);
      expect(fireEvent.keyDown(region, { key: 'ArrowRight', [modifier]: true })).toBe(true);
    }

    expect(api.scrollPrev).not.toHaveBeenCalled();
    expect(api.scrollNext).not.toHaveBeenCalled();
  });

  it('honors a descendant that already prevented the key', async () => {
    const api = await renderKeyboardCarousel();
    const button = screen.getByTestId('slide-button');
    button.addEventListener('keydown', (event) => event.preventDefault());

    fireEvent.keyDown(button, { key: 'ArrowRight' });

    expect(api.scrollNext).not.toHaveBeenCalled();
  });

  it('runs a consumer onKeyDown first and lets it opt out of navigation', async () => {
    const onKeyDown = vi.fn((event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowRight') event.preventDefault();
    });
    const api = await renderKeyboardCarousel({ onKeyDown });
    const region = screen.getByRole('region', { name: 'Gallery' });

    fireEvent.keyDown(region, { key: 'ArrowRight' });
    fireEvent.keyDown(region, { key: 'ArrowLeft' });

    expect(onKeyDown).toHaveBeenCalledTimes(2);
    expect(api.scrollNext).not.toHaveBeenCalled();
    expect(api.scrollPrev).toHaveBeenCalledTimes(1);
  });

  it('ignores Up/Down in a horizontal carousel', async () => {
    const api = await renderKeyboardCarousel();
    const region = screen.getByRole('region', { name: 'Gallery' });

    expect(fireEvent.keyDown(region, { key: 'ArrowUp' })).toBe(true);
    expect(fireEvent.keyDown(region, { key: 'ArrowDown' })).toBe(true);

    expect(api.scrollPrev).not.toHaveBeenCalled();
    expect(api.scrollNext).not.toHaveBeenCalled();
  });

  it('navigates a vertical carousel with Up/Down as well as Left/Right', async () => {
    const api = await renderKeyboardCarousel({ orientation: 'vertical' });
    const region = screen.getByRole('region', { name: 'Gallery' });

    expect(fireEvent.keyDown(region, { key: 'ArrowDown' })).toBe(false);
    expect(fireEvent.keyDown(region, { key: 'ArrowRight' })).toBe(false);
    expect(fireEvent.keyDown(region, { key: 'ArrowUp' })).toBe(false);
    expect(fireEvent.keyDown(region, { key: 'ArrowLeft' })).toBe(false);

    expect(api.scrollNext).toHaveBeenCalledTimes(2);
    expect(api.scrollPrev).toHaveBeenCalledTimes(2);
  });

  it('leaves Up/Down to a textarea inside a vertical carousel', async () => {
    const api = await renderKeyboardCarousel({ orientation: 'vertical' });
    const textarea = screen.getByLabelText('Notes');

    expect(fireEvent.keyDown(textarea, { key: 'ArrowUp' })).toBe(true);
    expect(fireEvent.keyDown(textarea, { key: 'ArrowDown' })).toBe(true);

    expect(api.scrollPrev).not.toHaveBeenCalled();
    expect(api.scrollNext).not.toHaveBeenCalled();
  });
});
