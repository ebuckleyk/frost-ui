import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from './Questionnaire';

const items = [
  {
    choices: [{ value: 'planning' }, { value: 'building' }, { value: 'reviewing' }],
    name: 'focus',
    required: true,
  },
  {
    choices: [{ value: 'brief' }, { value: 'detailed' }],
    name: 'detail',
  },
] as const;

const meta: Meta<typeof Questionnaire> = { component: Questionnaire };
export default meta;
type Story = StoryObj<typeof Questionnaire>;

export const Demo: Story = {
  render: () => (
    <Questionnaire className="mx-auto max-w-xl" items={items} onSubmit={(event) => event.preventDefault()}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="focus" required>
        <QuestionnaireTitle>What should we focus on next?</QuestionnaireTitle>
        <QuestionnaireDescription>Choose a direction or describe another task.</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="planning">
            <span className="font-medium">Planning</span>
            <QuestionnaireChoiceDescription>Shape the scope and sequence of the work.</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="building">
            <span className="font-medium">Building</span>
            <QuestionnaireChoiceDescription>
              Implement the next usable part of the experience.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="reviewing">
            <span className="font-medium">Reviewing</span>
            <QuestionnaireChoiceDescription>
              Validate the implementation and refine the details.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireInput aria-label="Another focus" placeholder="Describe another focus…" />
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="detail" multiple>
        <QuestionnaireTitle>How much detail should the handoff include?</QuestionnaireTitle>
        <QuestionnaireDescription>Select any useful options, or skip this question.</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="brief">Concise summary</QuestionnaireChoice>
          <QuestionnaireChoice value="detailed">Implementation details</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Save answers</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  ),
};
