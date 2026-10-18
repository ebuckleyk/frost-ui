import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Prose, Typography } from './Typography';

function TypographyDemo() {
  return (
    <div>
      <Prose.h1>The Joke Tax Chronicles</Prose.h1>
      <Prose.p>
        Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne. One
        day, his advisors came to him with a problem: the kingdom was running out of money.
      </Prose.p>
      <Prose.h2 className="mt-10">The King's Plan</Prose.h2>
      <Prose.p>
        The king thought long and hard, and finally came up with{' '}
        <a
          href="#"
          className="
          font-medium text-primary underline underline-offset-4
        "
        >
          a brilliant plan
        </a>
        : he would tax the jokes in the kingdom.
      </Prose.p>
      <Prose.blockquote>
        "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
      </Prose.blockquote>
      <Prose.h3 className="mt-8">The Joke Tax</Prose.h3>
      <Prose.p>The king's subjects were not amused. They grumbled and complained, but the king was firm:</Prose.p>
      <Prose.ul>
        <Prose.li>1st level of puns: 5 gold coins</Prose.li>
        <Prose.li>2nd level of jokes: 10 gold coins</Prose.li>
        <Prose.li>3rd level of one-liners : 20 gold coins</Prose.li>
      </Prose.ul>
      <Prose.p>
        As a result, people stopped telling jokes, and the kingdom fell into a gloom. But there was one person who
        refused to let the king's foolishness get him down: a court jester named Jokester.
      </Prose.p>
      <Prose.h3 className="mt-8">Jokester's Revolt</Prose.h3>
      <Prose.p>
        Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under
        the king's pillow, in his soup, even in the royal toilet. The king was furious, but he couldn't seem to stop
        Jokester.
      </Prose.p>
      <Prose.p>
        And then, one day, the people of the kingdom discovered that the jokes left by Jokester were so funny that they
        couldn't help but laugh. And once they started laughing, they couldn't stop.
      </Prose.p>
      <Prose.h3 className="mt-8">The People's Rebellion</Prose.h3>
      <Prose.p>
        The people of the kingdom, feeling uplifted by the laughter, started to tell jokes and puns again, and soon the
        entire kingdom was in on the joke.
      </Prose.p>
      <div className="my-6 w-full overflow-y-auto">
        <Prose.table>
          <Prose.thead>
            <Prose.tr>
              <Prose.th>King's Treasury</Prose.th>
              <Prose.th>People's happiness</Prose.th>
            </Prose.tr>
          </Prose.thead>
          <Prose.tbody>
            <Prose.tr>
              <Prose.td>Empty</Prose.td>
              <Prose.td>Overflowing</Prose.td>
            </Prose.tr>
            <Prose.tr>
              <Prose.td>Modest</Prose.td>
              <Prose.td>Satisfied</Prose.td>
            </Prose.tr>
            <Prose.tr>
              <Prose.td>Full</Prose.td>
              <Prose.td>Ecstatic</Prose.td>
            </Prose.tr>
          </Prose.tbody>
        </Prose.table>
      </div>
      <Prose.p>
        The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
        Jokester was declared a hero, and the kingdom lived happily ever after.
      </Prose.p>
      <Prose.p>
        The moral of the story is: never underestimate the power of a good laugh and always be careful of bad ideas.
      </Prose.p>
    </div>
  );
}

type ComponentType = React.ComponentProps<typeof Typography.p>;
const meta: Meta<ComponentType> = {
  component: Typography.p,
  parameters: {
    docs: {
      description: {
        component:
          'Typography/Text provide spacing-neutral application text. The element selects HTML semantics, variant selects visual role, and tone selects color. Start with Heading scale, then open an element demo to compare Typography and Prose side by side. HTML heading levels and visual roles are independent; h1 through h6 have distinct default sizes, and variant can override appearance without changing the HTML tag. Each example includes usage code.',
      },
    },
  },
  subcomponents: {
    h1: Typography.h1,
    h2: Typography.h2,
    h3: Typography.h3,
    h4: Typography.h4,
    h5: Typography.h5,
    h6: Typography.h6,
    span: Typography.span,
    div: Typography.div,
    a: Typography.a,
    label: Typography.label,
    p: Typography.p,
    ul: Typography.ul,
    li: Typography.li,
    blockQuote: Typography.blockquote,
    code: Typography.code,
    small: Typography.small,
    table: Typography.table,
    thead: Typography.thead,
    tbody: Typography.tbody,
    td: Typography.td,
    th: Typography.th,
    tr: Typography.tr,
  },
};

export default meta;

type Story = StoryObj<ComponentType>;
function Comparison({
  application,
  prose,
  code,
}: {
  application: React.ReactNode;
  prose: React.ReactNode;
  code: string;
}) {
  return (
    <div className="grid w-full max-w-4xl gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <section className="min-w-0 rounded-lg border p-5">
          <div className="mb-4 text-xs font-medium text-muted-foreground">Typography · application defaults</div>
          {application}
        </section>
        <section className="min-w-0 rounded-lg border p-5">
          <div className="mb-4 text-xs font-medium text-muted-foreground">Prose · document defaults</div>
          {prose}
        </section>
      </div>
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function elementStory(name: string, application: React.ReactNode, prose: React.ReactNode, code: string): Story {
  return {
    name,
    parameters: { controls: { disable: true }, docs: { source: { code } } },
    render: () => <Comparison application={application} prose={prose} code={code} />,
  };
}

export const HeadingScale: Story = {
  name: 'Heading scale',
  parameters: {
    docs: {
      description: {
        story:
          'Six compact, spacing-neutral defaults at every viewport: 1.75, 1.5, 1.25, 1.125, 1 and 0.875rem (28, 24, 20, 18, 16 and 14px at a 16px root). These scale with the root font size. The Prose column retains document typography.',
      },
    },
  },
  render: () => (
    <Comparison
      application={
        <div className="grid gap-5">
          <Typography.h1>H1 · Heading level one</Typography.h1>
          <Typography.h2>H2 · Heading level two</Typography.h2>
          <Typography.h3>H3 · Heading level three</Typography.h3>
          <Typography.h4>H4 · Heading level four</Typography.h4>
          <Typography.h5>H5 · Heading level five</Typography.h5>
          <Typography.h6>H6 · Heading level six</Typography.h6>
        </div>
      }
      prose={
        <div className="grid gap-5">
          <Prose.h1>H1 · Heading level one</Prose.h1>
          <Prose.h2>H2 · Heading level two</Prose.h2>
          <Prose.h3>H3 · Heading level three</Prose.h3>
          <Prose.h4>H4 · Heading level four</Prose.h4>
          <Prose.h5>H5 · Heading level five</Prose.h5>
          <Prose.h6>H6 · Heading level six</Prose.h6>
        </div>
      }
      code={
        '<Typography.h1>Heading level one</Typography.h1>\n<Typography.h2>Heading level two</Typography.h2>\n<Typography.h3>Heading level three</Typography.h3>\n<Typography.h4>Heading level four</Typography.h4>\n<Typography.h5>Heading level five</Typography.h5>\n<Typography.h6>Heading level six</Typography.h6>'
      }
    />
  ),
};

export const VariantOverrides: Story = {
  name: 'Independent visual variants',
  render: () => (
    <div className="grid max-w-3xl gap-6">
      <div className="grid gap-2">
        <code className="text-xs text-muted-foreground">{'<Typography.h1 variant="heading6">'}</code>
        <Typography.h1 variant="heading6">An h1 with the smallest heading style</Typography.h1>
      </div>
      <div className="grid gap-2">
        <code className="text-xs text-muted-foreground">{'<Typography.h6 variant="heading1">'}</code>
        <Typography.h6 variant="heading1">An h6 with the largest heading style</Typography.h6>
      </div>
      <div className="grid gap-2">
        <code className="text-xs text-muted-foreground">{'<Typography.h2 variant="cardTitle" tone="muted">'}</code>
        <Typography.h2 variant="cardTitle" tone="muted">
          A muted card title that remains an h2
        </Typography.h2>
      </div>
    </div>
  ),
};

export const Demo: Story = {
  name: 'Application roles',
  render: () => (
    <div className="grid max-w-3xl gap-5">
      <Typography.p variant="supporting" tone="muted">
        Choose a visual role independently of the HTML element. Containers own the spacing between these examples.
      </Typography.p>
      {(
        [
          ['pageTitle', 'Page title'],
          ['sectionTitle', 'Section title'],
          ['cardTitle', 'Card title'],
          ['body', 'Body text for ordinary application content.'],
          ['supporting', 'Supporting text for additional context.'],
          ['caption', 'Caption · Updated today'],
          ['label', 'Field label'],
          ['control', 'Control text'],
          ['badge', 'Badge text'],
          ['metric', '12,480'],
          ['eyebrow', 'Workspace overview'],
        ] as const
      ).map(([variant, text]) => (
        <div key={variant} className="grid gap-2 rounded-lg border p-4">
          <code className="text-xs text-muted-foreground">{`<Typography.p variant="${variant}">`}</code>
          <Typography.p variant={variant}>{text}</Typography.p>
        </div>
      ))}
    </div>
  ),
};

export const MetricsAndEyebrows: Story = {
  name: 'Metrics and eyebrows',
  render: () => (
    <div className="grid max-w-3xl gap-6">
      <Typography.p variant="supporting" tone="muted">
        Metrics emphasize values without making them headings. Eyebrows identify a category or section.
      </Typography.p>
      <div className="grid gap-4 sm:grid-cols-2">
        <section aria-labelledby="audience-category" className="grid gap-3 rounded-lg border p-5">
          <Typography.h2 id="audience-category" variant="eyebrow" tone="muted">
            Audience
          </Typography.h2>
          <dl className="grid gap-1">
            <Typography.p as="dt" variant="label">
              Active subscribers
            </Typography.p>
            <Typography.p as="dd" variant="metric">
              12,480
            </Typography.p>
          </dl>
          <Typography.p variant="caption" tone="muted">
            Updated today
          </Typography.p>
        </section>
        <section aria-labelledby="billing-category" className="grid gap-3 rounded-lg border p-5">
          <Typography.h2 id="billing-category" variant="eyebrow" tone="muted">
            Billing
          </Typography.h2>
          <dl className="grid gap-1">
            <Typography.p as="dt" variant="label">
              Monthly total
            </Typography.p>
            <Typography.p as="dd" variant="metric">
              $1,280.00
            </Typography.p>
          </dl>
          <Typography.p variant="caption" tone="muted">
            Includes all workspace seats
          </Typography.p>
        </section>
      </div>
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
        <code>{`<Typography.h2 variant="eyebrow" tone="muted">Audience</Typography.h2>
<Typography.p as="dd" variant="metric">12,480</Typography.p>`}</code>
      </pre>
    </div>
  ),
};

export const Heading1: Story = elementStory(
  'Heading 1',
  <Typography.h1>Your workspace</Typography.h1>,
  <Prose.h1>Your workspace</Prose.h1>,
  `<Typography.h1>Your workspace</Typography.h1>
<Prose.h1>Your workspace</Prose.h1>`,
);

export const Heading2: Story = elementStory(
  'Heading 2',
  <Typography.h2>Project overview</Typography.h2>,
  <Prose.h2>Project overview</Prose.h2>,
  `<Typography.h2>Project overview</Typography.h2>
<Prose.h2>Project overview</Prose.h2>`,
);

export const Heading3: Story = elementStory(
  'Heading 3',
  <Typography.h3>Recent activity</Typography.h3>,
  <Prose.h3>Recent activity</Prose.h3>,
  `<Typography.h3>Recent activity</Typography.h3>
<Prose.h3>Recent activity</Prose.h3>`,
);

export const Heading4: Story = elementStory(
  'Heading 4',
  <Typography.h4>Notification settings</Typography.h4>,
  <Prose.h4>Notification settings</Prose.h4>,
  `<Typography.h4>Notification settings</Typography.h4>
<Prose.h4>Notification settings</Prose.h4>`,
);

export const Heading5: Story = elementStory(
  'Heading 5',
  <Typography.h5>Email notifications</Typography.h5>,
  <Prose.h5>Email notifications</Prose.h5>,
  `<Typography.h5>Email notifications</Typography.h5>
<Prose.h5>Email notifications</Prose.h5>`,
);

export const Heading6: Story = elementStory(
  'Heading 6',
  <Typography.h6>Delivery preferences</Typography.h6>,
  <Prose.h6>Delivery preferences</Prose.h6>,
  `<Typography.h6>Delivery preferences</Typography.h6>
<Prose.h6>Delivery preferences</Prose.h6>`,
);

export const Paragraph: Story = elementStory(
  'Paragraph',
  <>
    <Typography.p>Body text stays readable across application screens and document content.</Typography.p>
    <Typography.p>A second paragraph makes the spacing difference visible.</Typography.p>
  </>,
  <>
    <Prose.p>Body text stays readable across application screens and document content.</Prose.p>
    <Prose.p>A second paragraph makes the spacing difference visible.</Prose.p>
  </>,
  `<Typography.p>Body text stays readable across application screens and document content.</Typography.p>
<Prose.p>Body text stays readable across application screens and document content.</Prose.p>`,
);

export const InlineSpan: Story = elementStory(
  'Inline span',
  <p>
    Context: <Typography.span>Inline text within a sentence.</Typography.span> More text follows.
  </p>,
  <p>
    Context: <Prose.span>Inline text within a sentence.</Prose.span> More text follows.
  </p>,
  `<Typography.span>Inline text within a sentence.</Typography.span>
<Prose.span>Inline text within a sentence.</Prose.span>`,
);

export const Division: Story = elementStory(
  'Division',
  <Typography.div>A block of application text.</Typography.div>,
  <Prose.div>A block of application text.</Prose.div>,
  `<Typography.div>A block of application text.</Typography.div>
<Prose.div>A block of application text.</Prose.div>`,
);

export const Small: Story = elementStory(
  'Small text',
  <p>
    Context: <Typography.small>Last updated a few moments ago.</Typography.small> More text follows.
  </p>,
  <p>
    Context: <Prose.small>Last updated a few moments ago.</Prose.small> More text follows.
  </p>,
  `<Typography.small>Last updated a few moments ago.</Typography.small>
<Prose.small>Last updated a few moments ago.</Prose.small>`,
);

export const Blockquote: Story = elementStory(
  'Blockquote',
  <Typography.blockquote>Good typography makes the hierarchy clear.</Typography.blockquote>,
  <Prose.blockquote>Good typography makes the hierarchy clear.</Prose.blockquote>,
  `<Typography.blockquote>Good typography makes the hierarchy clear.</Typography.blockquote>
<Prose.blockquote>Good typography makes the hierarchy clear.</Prose.blockquote>`,
);

export const Code: Story = elementStory(
  'Inline code',
  <p>
    Context: <Typography.code>npm install @ebuckleyk/frost-ui</Typography.code> More text follows.
  </p>,
  <p>
    Context: <Prose.code>npm install @ebuckleyk/frost-ui</Prose.code> More text follows.
  </p>,
  `<Typography.code>npm install @ebuckleyk/frost-ui</Typography.code>
<Prose.code>npm install @ebuckleyk/frost-ui</Prose.code>`,
);

export const Link: Story = elementStory(
  'Anchor link',
  <Typography.a href="#typography-link-target">Jump to the example target</Typography.a>,
  <Prose.a href="#typography-link-target">Jump to the example target</Prose.a>,
  '<Typography.a href="#typography-link-target">Jump to the example target</Typography.a>',
);
Link.decorators = [
  (Story) => (
    <div className="grid gap-5">
      <Story />
      <Typography.p id="typography-link-target">
        Link target: anchors retain native navigation. Add underline styling when needed for discoverability.
      </Typography.p>
    </div>
  ),
];

export const Label: Story = elementStory(
  'Label',
  <div className="grid gap-2">
    <Typography.label htmlFor="typography-label-demo">Project name</Typography.label>
    <input id="typography-label-demo" className="rounded-md border p-2" placeholder="Application label" />
  </div>,
  <div className="grid gap-2">
    <Prose.label htmlFor="prose-label-demo">Project name</Prose.label>
    <input id="prose-label-demo" className="rounded-md border p-2" placeholder="Document label" />
  </div>,
  '<Typography.label htmlFor="project">Project name</Typography.label>\n<input id="project" />',
);

export const UnorderedList: Story = elementStory(
  'Unordered list',
  <Typography.ul>
    <Typography.li>Design the interface</Typography.li>
    <Typography.li>Review the details</Typography.li>
  </Typography.ul>,
  <Prose.ul>
    <Prose.li>Design the interface</Prose.li>
    <Prose.li>Review the details</Prose.li>
  </Prose.ul>,
  '<Typography.ul>\n  <Typography.li>Design the interface</Typography.li>\n</Typography.ul>\n\n<Prose.ul>\n  <Prose.li>Design the interface</Prose.li>\n</Prose.ul>',
);

export const ListItem: Story = elementStory(
  'List item',
  <ul>
    <Typography.li>A list item inside its required list parent.</Typography.li>
  </ul>,
  <Prose.ul>
    <Prose.li>A list item inside its document list.</Prose.li>
  </Prose.ul>,
  '<ul><Typography.li>A list item</Typography.li></ul>\n<Prose.ul><Prose.li>A list item</Prose.li></Prose.ul>',
);

export const Table: Story = elementStory(
  'Table',
  <Typography.table>
    <caption>Table in valid table context</caption>
    <thead>
      <tr>
        <th scope="col">Project</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Frost UI</td>
        <td>In progress</td>
      </tr>
    </tbody>
  </Typography.table>,
  <Prose.table>
    <caption>Table in valid table context</caption>
    <thead>
      <tr>
        <th scope="col">Project</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Frost UI</td>
        <td>In progress</td>
      </tr>
    </tbody>
  </Prose.table>,
  `<Typography.table><caption>Table in valid table context</caption><thead><tr><th scope="col">Project</th><th scope="col">Status</th></tr></thead><tbody><tr><td>Frost UI</td><td>In progress</td></tr></tbody></Typography.table>

<Prose.table><caption>Table in valid table context</caption><thead><tr><th scope="col">Project</th><th scope="col">Status</th></tr></thead><tbody><tr><td>Frost UI</td><td>In progress</td></tr></tbody></Prose.table>`,
);

export const TableHead: Story = elementStory(
  'Table head',
  <table>
    <caption>Table head in valid table context</caption>
    <Typography.thead>
      <tr>
        <th scope="col">Project</th>
        <th scope="col">Status</th>
      </tr>
    </Typography.thead>
    <tbody>
      <tr>
        <td>Frost UI</td>
        <td>In progress</td>
      </tr>
    </tbody>
  </table>,
  <table>
    <caption>Table head in valid table context</caption>
    <Prose.thead>
      <tr>
        <th scope="col">Project</th>
        <th scope="col">Status</th>
      </tr>
    </Prose.thead>
    <tbody>
      <tr>
        <td>Frost UI</td>
        <td>In progress</td>
      </tr>
    </tbody>
  </table>,
  `<table><caption>Table head in valid table context</caption><Typography.thead><tr><th scope="col">Project</th><th scope="col">Status</th></tr></Typography.thead><tbody><tr><td>Frost UI</td><td>In progress</td></tr></tbody></table>

<table><caption>Table head in valid table context</caption><Prose.thead><tr><th scope="col">Project</th><th scope="col">Status</th></tr></Prose.thead><tbody><tr><td>Frost UI</td><td>In progress</td></tr></tbody></table>`,
);

export const TableBody: Story = elementStory(
  'Table body',
  <table>
    <caption>Table body in valid table context</caption>
    <thead>
      <tr>
        <th scope="col">Project</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <Typography.tbody>
      <tr>
        <td>Frost UI</td>
        <td>In progress</td>
      </tr>
    </Typography.tbody>
  </table>,
  <table>
    <caption>Table body in valid table context</caption>
    <thead>
      <tr>
        <th scope="col">Project</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <Prose.tbody>
      <tr>
        <td>Frost UI</td>
        <td>In progress</td>
      </tr>
    </Prose.tbody>
  </table>,
  `<table><caption>Table body in valid table context</caption><thead><tr><th scope="col">Project</th><th scope="col">Status</th></tr></thead><Typography.tbody><tr><td>Frost UI</td><td>In progress</td></tr></Typography.tbody></table>

<table><caption>Table body in valid table context</caption><thead><tr><th scope="col">Project</th><th scope="col">Status</th></tr></thead><Prose.tbody><tr><td>Frost UI</td><td>In progress</td></tr></Prose.tbody></table>`,
);

export const TableRow: Story = elementStory(
  'Table row',
  <table>
    <caption>Table row in valid table context</caption>
    <thead>
      <Typography.tr>
        <th scope="col">Project</th>
        <th scope="col">Status</th>
      </Typography.tr>
    </thead>
    <tbody>
      <Typography.tr>
        <td>Frost UI</td>
        <td>In progress</td>
      </Typography.tr>
    </tbody>
  </table>,
  <table>
    <caption>Table row in valid table context</caption>
    <thead>
      <Prose.tr>
        <th scope="col">Project</th>
        <th scope="col">Status</th>
      </Prose.tr>
    </thead>
    <tbody>
      <Prose.tr>
        <td>Frost UI</td>
        <td>In progress</td>
      </Prose.tr>
    </tbody>
  </table>,
  `<table><caption>Table row in valid table context</caption><thead><Typography.tr><th scope="col">Project</th><th scope="col">Status</th></Typography.tr></thead><tbody><Typography.tr><td>Frost UI</td><td>In progress</td></Typography.tr></tbody></table>

<table><caption>Table row in valid table context</caption><thead><Prose.tr><th scope="col">Project</th><th scope="col">Status</th></Prose.tr></thead><tbody><Prose.tr><td>Frost UI</td><td>In progress</td></Prose.tr></tbody></table>`,
);

export const TableHeaderCell: Story = elementStory(
  'Table header cell',
  <table>
    <caption>Table header cell in valid table context</caption>
    <thead>
      <tr>
        <Typography.th scope="col">Project</Typography.th>
        <Typography.th scope="col">Status</Typography.th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Frost UI</td>
        <td>In progress</td>
      </tr>
    </tbody>
  </table>,
  <table>
    <caption>Table header cell in valid table context</caption>
    <thead>
      <tr>
        <Prose.th scope="col">Project</Prose.th>
        <Prose.th scope="col">Status</Prose.th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Frost UI</td>
        <td>In progress</td>
      </tr>
    </tbody>
  </table>,
  `<table><caption>Table header cell in valid table context</caption><thead><tr><Typography.th scope="col">Project</Typography.th><Typography.th scope="col">Status</Typography.th></tr></thead><tbody><tr><td>Frost UI</td><td>In progress</td></tr></tbody></table>

<table><caption>Table header cell in valid table context</caption><thead><tr><Prose.th scope="col">Project</Prose.th><Prose.th scope="col">Status</Prose.th></tr></thead><tbody><tr><td>Frost UI</td><td>In progress</td></tr></tbody></table>`,
);

export const TableCell: Story = elementStory(
  'Table cell',
  <table>
    <caption>Table cell in valid table context</caption>
    <thead>
      <tr>
        <th scope="col">Project</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <Typography.td>Frost UI</Typography.td>
        <Typography.td>In progress</Typography.td>
      </tr>
    </tbody>
  </table>,
  <table>
    <caption>Table cell in valid table context</caption>
    <thead>
      <tr>
        <th scope="col">Project</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <Prose.td>Frost UI</Prose.td>
        <Prose.td>In progress</Prose.td>
      </tr>
    </tbody>
  </table>,
  `<table><caption>Table cell in valid table context</caption><thead><tr><th scope="col">Project</th><th scope="col">Status</th></tr></thead><tbody><tr><Typography.td>Frost UI</Typography.td><Typography.td>In progress</Typography.td></tr></tbody></table>

<table><caption>Table cell in valid table context</caption><thead><tr><th scope="col">Project</th><th scope="col">Status</th></tr></thead><tbody><tr><Prose.td>Frost UI</Prose.td><Prose.td>In progress</Prose.td></tr></tbody></table>`,
);

export const Tones: Story = {
  render: () => (
    <div className="grid gap-4">
      <Typography.h2>Default tone</Typography.h2>
      <Typography.h2 tone="muted">Muted tone, still an h2</Typography.h2>
      <Typography.h2 tone="destructive">Destructive tone, still an h2</Typography.h2>
    </div>
  ),
};

export const DocumentTextStyles: Story = {
  render: () => (
    <div className="grid gap-4">
      <Prose.p variant="lead">Lead: an introduction to an article.</Prose.p>
      <Prose.div variant="large">Large: emphasized document text.</Prose.div>
      <Prose.small>Small: compact document text.</Prose.small>
      <Prose.p variant="muted">Muted: secondary document text.</Prose.p>
    </div>
  ),
};

export const ProseDocument: Story = {
  name: 'Complete prose document',
  render: TypographyDemo,
};
