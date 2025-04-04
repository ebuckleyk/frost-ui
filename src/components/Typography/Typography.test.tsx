import * as React from 'react';
import { render } from '@testing-library/react';

import { Typography } from './Typography';

function Component() {
  return (
    <div>
      <Typography.h1>The Joke Tax Chronicles</Typography.h1>
      <Typography.p>
        Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne. One
        day, his advisors came to him with a problem: the kingdom was running out of money.
      </Typography.p>
      <Typography.h2 className="mt-10">The King's Plan</Typography.h2>
      <Typography.p>
        The king thought long and hard, and finally came up with{' '}
        <a href="#" className="font-medium text-primary underline underline-offset-4">
          a brilliant plan
        </a>
        : he would tax the jokes in the kingdom.
      </Typography.p>
      <Typography.blockquote>
        "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
      </Typography.blockquote>
      <Typography.h3 className="mt-8">The Joke Tax</Typography.h3>
      <Typography.p>
        The king's subjects were not amused. They grumbled and complained, but the king was firm:
      </Typography.p>
      <Typography.ul>
        <Typography.li>1st level of puns: 5 gold coins</Typography.li>
        <Typography.li>2nd level of jokes: 10 gold coins</Typography.li>
        <Typography.li>3rd level of one-liners : 20 gold coins</Typography.li>
      </Typography.ul>
      <Typography.p>
        As a result, people stopped telling jokes, and the kingdom fell into a gloom. But there was one person who
        refused to let the king's foolishness get him down: a court jester named Jokester.
      </Typography.p>
      <Typography.h3 className="mt-8">Jokester's Revolt</Typography.h3>
      <Typography.p>
        Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under
        the king's pillow, in his soup, even in the royal toilet. The king was furious, but he couldn't seem to stop
        Jokester.
      </Typography.p>
      <Typography.p>
        And then, one day, the people of the kingdom discovered that the jokes left by Jokester were so funny that they
        couldn't help but laugh. And once they started laughing, they couldn't stop.
      </Typography.p>
      <Typography.h3 className="mt-8">The People's Rebellion</Typography.h3>
      <Typography.p>
        The people of the kingdom, feeling uplifted by the laughter, started to tell jokes and puns again, and soon the
        entire kingdom was in on the joke.
      </Typography.p>
      <div className="my-6 w-full overflow-y-auto">
        <Typography.table>
          <Typography.thead>
            <Typography.tr>
              <Typography.th>King's Treasury</Typography.th>
              <Typography.th>People's happiness</Typography.th>
            </Typography.tr>
          </Typography.thead>
          <Typography.tbody>
            <Typography.tr>
              <Typography.td>Empty</Typography.td>
              <Typography.td>Overflowing</Typography.td>
            </Typography.tr>
            <Typography.tr>
              <Typography.td>Modest</Typography.td>
              <Typography.td>Satisfied</Typography.td>
            </Typography.tr>
            <Typography.tr>
              <Typography.td>Full</Typography.td>
              <Typography.td>Ecstatic</Typography.td>
            </Typography.tr>
          </Typography.tbody>
        </Typography.table>
      </div>
      <Typography.p>
        The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
        Jokester was declared a hero, and the kingdom lived happily ever after.
      </Typography.p>
      <Typography.p>
        The moral of the story is: never underestimate the power of a good laugh and always be careful of bad ideas.
      </Typography.p>
    </div>
  );
}

describe('Typography', () => {
  it('should render Typography component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
