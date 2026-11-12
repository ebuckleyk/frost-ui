import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Home, Inbox, Search, Settings } from 'lucide-react';

import { RichTextEditor } from '../RichText';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from './Sidebar';

const items = [
  {
    title: 'Home',
    url: '#',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox,
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Search,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
];

function Component() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    </SidebarProvider>
  );
}

describe('Sidebar', () => {
  it('should render Sidebar component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});

const COOKIE_NAME = 'sidebar_state';

function readSidebarCookie() {
  const entry = document.cookie.split('; ').find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return entry?.split('=')[1];
}

function clearSidebarCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

function StateProbe() {
  const { open, openMobile, toggleSidebar } = useSidebar();
  return (
    <>
      <output data-testid="open">{String(open)}</output>
      <output data-testid="open-mobile">{String(openMobile)}</output>
      <button type="button" onClick={toggleSidebar}>
        Toggle sidebar
      </button>
    </>
  );
}

const openState = () => screen.getByTestId('open').textContent;
const openMobileState = () => screen.getByTestId('open-mobile').textContent;
const clickToggle = () => fireEvent.click(screen.getByRole('button', { name: 'Toggle sidebar' }));

describe('SidebarProvider open state', () => {
  beforeEach(clearSidebarCookie);

  it('toggles uncontrolled state from defaultOpen without onOpenChange', () => {
    render(
      <SidebarProvider defaultOpen>
        <StateProbe />
      </SidebarProvider>,
    );

    expect(openState()).toBe('true');
    clickToggle();
    expect(openState()).toBe('false');
    expect(readSidebarCookie()).toBe('false');
    clickToggle();
    expect(openState()).toBe('true');
    expect(readSidebarCookie()).toBe('true');
  });

  it('keeps updating uncontrolled state when only onOpenChange is supplied', () => {
    const onOpenChange = vi.fn();
    render(
      <SidebarProvider defaultOpen onOpenChange={onOpenChange}>
        <StateProbe />
      </SidebarProvider>,
    );

    clickToggle();
    expect(openState()).toBe('false');
    expect(readSidebarCookie()).toBe('false');
    clickToggle();
    expect(openState()).toBe('true');
    expect(readSidebarCookie()).toBe('true');
    clickToggle();
    expect(openState()).toBe('false');
    expect(readSidebarCookie()).toBe('false');

    expect(onOpenChange.mock.calls).toEqual([[false], [true], [false]]);
  });

  it('respects defaultOpen={false} with onOpenChange', () => {
    const onOpenChange = vi.fn();
    render(
      <SidebarProvider defaultOpen={false} onOpenChange={onOpenChange}>
        <StateProbe />
      </SidebarProvider>,
    );

    expect(openState()).toBe('false');
    clickToggle();
    expect(openState()).toBe('true');
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
  });

  it('follows a controlled parent that accepts changes', () => {
    const onOpenChange = vi.fn();
    function AcceptingParent() {
      const [open, setOpen] = React.useState(true);
      return (
        <SidebarProvider
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <StateProbe />
        </SidebarProvider>
      );
    }
    render(<AcceptingParent />);

    clickToggle();
    expect(openState()).toBe('false');
    expect(readSidebarCookie()).toBe('false');
    clickToggle();
    expect(openState()).toBe('true');
    expect(readSidebarCookie()).toBe('true');
    expect(onOpenChange.mock.calls).toEqual([[false], [true]]);
  });

  it('keeps parent-owned state when a controlled parent rejects changes', () => {
    const onOpenChange = vi.fn();
    render(
      <SidebarProvider open onOpenChange={onOpenChange}>
        <StateProbe />
      </SidebarProvider>,
    );

    clickToggle();
    clickToggle();
    expect(openState()).toBe('true');
    expect(onOpenChange.mock.calls).toEqual([[false], [false]]);
    expect(readSidebarCookie()).toBeUndefined();
  });

  it('ignores defaultOpen when open is controlled', () => {
    render(
      <SidebarProvider open={false} defaultOpen>
        <StateProbe />
      </SidebarProvider>,
    );

    expect(openState()).toBe('false');
  });
});

describe('SidebarProvider keyboard shortcut', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
  });

  function renderWithEditableFields() {
    return render(
      <SidebarProvider defaultOpen>
        <StateProbe />
        <input aria-label="Text input" />
        <textarea aria-label="Notes" />
        <select aria-label="Choice">
          <option>One</option>
        </select>
        <div data-testid="editable" contentEditable suppressContentEditableWarning>
          <span data-testid="editable-child">Editable text</span>
        </div>
        <div data-testid="not-editable" contentEditable={false}>
          Static
        </div>
        <button type="button" onKeyDown={(event) => event.preventDefault()}>
          Handled control
        </button>
      </SidebarProvider>,
    );
  }

  it('toggles once per press from non-editable page context with Ctrl+B and Meta+B', () => {
    renderWithEditableFields();

    fireEvent.keyDown(document.body, { key: 'b', ctrlKey: true });
    expect(openState()).toBe('false');
    fireEvent.keyDown(screen.getByRole('button', { name: 'Toggle sidebar' }), { key: 'b', metaKey: true });
    expect(openState()).toBe('true');
    fireEvent.keyDown(screen.getByTestId('not-editable'), { key: 'b', ctrlKey: true });
    expect(openState()).toBe('false');
  });

  it.each([
    ['text input', () => screen.getByRole('textbox', { name: 'Text input' })],
    ['textarea', () => screen.getByRole('textbox', { name: 'Notes' })],
    ['select', () => screen.getByRole('combobox', { name: 'Choice' })],
    ['contenteditable element', () => screen.getByTestId('editable')],
    ['contenteditable descendant', () => screen.getByTestId('editable-child')],
  ])('ignores Ctrl/Meta+B from a %s', (_label, getTarget) => {
    renderWithEditableFields();

    fireEvent.keyDown(getTarget(), { key: 'b', ctrlKey: true });
    expect(openState()).toBe('true');
    fireEvent.keyDown(getTarget(), { key: 'b', metaKey: true });
    expect(openState()).toBe('true');
  });

  it('honors child keyboard handlers that call preventDefault', () => {
    renderWithEditableFields();

    fireEvent.keyDown(screen.getByRole('button', { name: 'Handled control' }), { key: 'b', ctrlKey: true });
    expect(openState()).toBe('true');
  });

  it('ignores Ctrl/Meta+B inside a RichTextEditor', () => {
    render(
      <SidebarProvider defaultOpen>
        <StateProbe />
        <RichTextEditor value={[{ type: 'paragraph', children: [{ text: 'Draft' }] }]} onValueChange={vi.fn()} />
      </SidebarProvider>,
    );

    const editor = screen.getByRole('textbox');
    fireEvent.keyDown(editor, { key: 'b', ctrlKey: true });
    expect(openState()).toBe('true');
    fireEvent.keyDown(editor, { key: 'b', metaKey: true });
    expect(openState()).toBe('true');
  });

  it('applies the same rules to the mobile state', async () => {
    window.innerWidth = 500;
    renderWithEditableFields();
    await act(async () => {});

    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Text input' }), { key: 'b', ctrlKey: true });
    expect(openMobileState()).toBe('false');
    fireEvent.keyDown(screen.getByRole('button', { name: 'Handled control' }), { key: 'b', ctrlKey: true });
    expect(openMobileState()).toBe('false');

    fireEvent.keyDown(document.body, { key: 'b', ctrlKey: true });
    expect(openMobileState()).toBe('true');
    expect(openState()).toBe('true');
  });
});
