import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
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
  { choices: [{ value: 'yes' }, { value: 'no' }], name: 'first', required: true },
  { choices: [{ value: 'later' }], name: 'second' },
] as const;

function TestQuestionnaire({ onSubmit = vi.fn() }: { onSubmit?: React.FormEventHandler<HTMLFormElement> }) {
  return (
    <Questionnaire items={items} onSubmit={onSubmit}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="first" required>
        <QuestionnaireTitle>Required question</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="yes">Yes</QuestionnaireChoice>
          <QuestionnaireChoice value="no">No</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="second">
        <QuestionnaireTitle>Optional question</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="later">Later</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Save</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}

describe('Questionnaire', () => {
  it('validates required answers before moving to the next question', () => {
    render(<TestQuestionnaire />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Question 1 of 2');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Choose an answer to continue.');

    fireEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByRole('group', { name: 'Optional question' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Save' })).toBeVisible();
  });

  it('lets users skip an optional question', () => {
    render(<TestQuestionnaire />);

    fireEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));

    expect(screen.getByRole('button', { name: 'Save' })).toBeVisible();
  });

  it('accepts default and controlled required answers without repeatedly updating state', () => {
    const controlledItems = [
      { choices: [{ value: 'default' }, { value: 'controlled' }], name: 'choice', required: true },
      { name: 'defaultInput', required: true },
      { name: 'controlledInput', required: true },
    ] as const;

    render(
      <Questionnaire items={controlledItems} onSubmit={(event) => event.preventDefault()}>
        <QuestionnaireItem name="choice" required>
          <QuestionnaireTitle>Choice</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice defaultChecked value="default">
              Default answer
            </QuestionnaireChoice>
            <QuestionnaireChoice checked value="controlled">
              Controlled answer
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="defaultInput" required>
          <QuestionnaireTitle>Default input</QuestionnaireTitle>
          <QuestionnaireInput defaultValue="Default answer" aria-label="Default input" />
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="controlledInput" required>
          <QuestionnaireTitle>Controlled input</QuestionnaireTitle>
          <QuestionnaireInput value="Already answered" aria-label="Controlled input" />
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnaireNext />
          <QuestionnaireSubmit>Submit</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('textbox', { name: 'Default input' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('textbox', { name: 'Controlled input' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('skips disabled items, disables item-defined choices, and preserves generated descriptions', () => {
    const disabledItems = [
      { choices: [{ value: 'unavailable' }], disabled: true, name: 'disabled' },
      { choices: [{ disabled: true, value: 'blocked' }, { value: 'available' }], name: 'active', required: true },
    ] as const;

    render(
      <Questionnaire items={disabledItems}>
        <QuestionnaireItem name="disabled">
          <QuestionnaireTitle>Disabled item</QuestionnaireTitle>
        </QuestionnaireItem>
        <QuestionnaireItem aria-describedby="consumer-description" name="active" required>
          <QuestionnaireTitle>Active item</QuestionnaireTitle>
          <QuestionnaireDescription>Generated description</QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="blocked">Blocked choice</QuestionnaireChoice>
            <QuestionnaireChoice value="available">Available choice</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnaireSubmit>Submit</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>,
    );

    const activeItem = screen.getByRole('group', { name: 'Active item' });
    expect(activeItem).toBeVisible();
    expect(screen.getByRole('radio', { name: 'Blocked choice' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    const description = screen.getByText('Generated description');
    const error = screen.getByRole('alert');
    expect(activeItem).toHaveAttribute('aria-describedby', expect.stringContaining('consumer-description'));
    expect(activeItem).toHaveAttribute('aria-describedby', expect.stringContaining(description.id));
    expect(activeItem).toHaveAttribute('aria-describedby', expect.stringContaining(error.id));
  });

  it('does not make every multiple-choice option natively required', () => {
    render(
      <Questionnaire
        items={[{ choices: [{ value: 'one' }, { value: 'two' }], name: 'multiple', required: true }]}
        noValidate={false}
      >
        <QuestionnaireItem multiple name="multiple" required>
          <QuestionnaireTitle>Multiple choice</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="one">One</QuestionnaireChoice>
            <QuestionnaireChoice value="two">Two</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
      </Questionnaire>,
    );

    const options = screen.getAllByRole('checkbox');
    expect(options).toHaveLength(2);
    expect(options[0]).not.toBeRequired();
    expect(options[1]).not.toBeRequired();
    expect(options[0].form?.checkValidity()).toBe(true);
  });

  it('treats an enabled item before disabled trailing steps as the last step', () => {
    render(
      <Questionnaire
        items={[
          { choices: [{ value: 'answer' }], name: 'active', required: true },
          { disabled: true, name: 'disabled' },
        ]}
      >
        <QuestionnaireItem name="active" required>
          <QuestionnaireTitle>Active item</QuestionnaireTitle>
          <QuestionnaireChoice value="answer">Answer</QuestionnaireChoice>
        </QuestionnaireItem>
        <QuestionnaireItem name="disabled">
          <QuestionnaireTitle>Disabled item</QuestionnaireTitle>
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnaireNext />
          <QuestionnaireSubmit>Submit</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>,
    );

    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  it('does not submit a blank freeform value when a fixed choice is selected', () => {
    render(
      <Questionnaire items={[{ choices: [{ value: 'choice' }], name: 'answer', required: true }]}>
        <QuestionnaireItem name="answer" required>
          <QuestionnaireTitle>Answer</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="choice">Fixed choice</QuestionnaireChoice>
            <QuestionnaireInput aria-label="Another answer" />
          </QuestionnaireChoices>
        </QuestionnaireItem>
      </Questionnaire>,
    );

    const choice = screen.getByRole('radio', { name: 'Fixed choice' });
    fireEvent.click(choice);

    expect(Array.from(new FormData(choice.form ?? undefined).getAll('answer'))).toEqual(['choice']);
    expect(screen.getByRole('textbox', { name: 'Another answer' })).not.toHaveAttribute('name');
  });

  it('routes shortcuts through controlled choice change handlers', () => {
    const onChange = vi.fn();

    function ControlledQuestionnaire() {
      const [checked, setChecked] = React.useState(false);

      return (
        <Questionnaire
          aria-label="Shortcut questionnaire"
          items={[{ choices: [{ value: 'choice' }], name: 'answer' }]}
          shortcuts="letters"
        >
          <QuestionnaireItem name="answer">
            <QuestionnaireTitle>Answer</QuestionnaireTitle>
            <QuestionnaireChoice
              checked={checked}
              value="choice"
              onChange={(event) => {
                onChange(event);
                setChecked(event.target.checked);
              }}
            >
              Fixed choice
            </QuestionnaireChoice>
          </QuestionnaireItem>
        </Questionnaire>
      );
    }

    render(<ControlledQuestionnaire />);
    fireEvent.keyDown(screen.getByRole('form', { name: 'Shortcut questionnaire' }), { key: 'a' });

    expect(onChange).toHaveBeenCalledOnce();
    expect(screen.getByRole('radio', { name: 'Fixed choice' })).toBeChecked();
  });

  it('advances instead of submitting from a non-final freeform question', () => {
    const onSubmit = vi.fn();

    render(
      <Questionnaire
        aria-label="Freeform questionnaire"
        items={[
          { name: 'first', required: true },
          { name: 'second', required: true },
        ]}
        onSubmit={onSubmit}
      >
        <QuestionnaireItem name="first" required>
          <QuestionnaireTitle>First question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="First answer" />
        </QuestionnaireItem>
        <QuestionnaireItem name="second" required>
          <QuestionnaireTitle>Second question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Second answer" />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnaireSubmit>Submit</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'First answer' }), { target: { value: 'Answer' } });
    fireEvent.submit(screen.getByRole('form', { name: 'Freeform questionnaire' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('group', { name: 'Second question' })).toBeVisible();
  });

  it('reports progress across enabled questions only', () => {
    render(
      <Questionnaire
        items={[
          { disabled: true, name: 'disabled-first' },
          { choices: [{ value: 'answer' }], name: 'first' },
          { disabled: true, name: 'disabled-middle' },
          { choices: [{ value: 'next' }], name: 'second' },
        ]}
      >
        <QuestionnaireProgress />
        <QuestionnaireItem name="disabled-first">
          <QuestionnaireTitle>Disabled first question</QuestionnaireTitle>
        </QuestionnaireItem>
        <QuestionnaireItem name="first">
          <QuestionnaireTitle>First enabled question</QuestionnaireTitle>
          <QuestionnaireChoice value="answer">Answer</QuestionnaireChoice>
        </QuestionnaireItem>
        <QuestionnaireItem name="disabled-middle">
          <QuestionnaireTitle>Disabled middle question</QuestionnaireTitle>
        </QuestionnaireItem>
        <QuestionnaireItem name="second">
          <QuestionnaireTitle>Second enabled question</QuestionnaireTitle>
          <QuestionnaireChoice value="next">Next answer</QuestionnaireChoice>
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnaireNext />
        </QuestionnaireActions>
      </Questionnaire>,
    );

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '1');
    expect(progress).toHaveAttribute('aria-valuemax', '2');
    expect(progress).toHaveAttribute('aria-valuetext', 'Question 1 of 2');

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(progress).toHaveAttribute('aria-valuenow', '2');
    expect(progress).toHaveAttribute('aria-valuemax', '2');
    expect(progress).toHaveAttribute('aria-valuetext', 'Question 2 of 2');
  });

  it('does not assign duplicate shortcuts after the available keys are exhausted', () => {
    const letterChoices = Array.from({ length: 27 }, (_, index) => ({ value: `letter-${index}` }));
    const numberChoices = Array.from({ length: 10 }, (_, index) => ({ value: `number-${index}` }));

    const { rerender } = render(
      <Questionnaire items={[{ choices: letterChoices, name: 'letters' }]} shortcuts="letters">
        <QuestionnaireItem name="letters">
          <QuestionnaireTitle>Letters</QuestionnaireTitle>
          {letterChoices.map((choice, index) => (
            <QuestionnaireChoice key={choice.value} value={choice.value}>
              Letter {index + 1}
            </QuestionnaireChoice>
          ))}
        </QuestionnaireItem>
      </Questionnaire>,
    );

    expect(screen.getByRole('radio', { name: 'Letter 1' }).parentElement).toHaveAttribute('data-shortcut', 'A');
    expect(screen.getByRole('radio', { name: 'Letter 27' }).parentElement).not.toHaveAttribute('data-shortcut');

    rerender(
      <Questionnaire items={[{ choices: numberChoices, name: 'numbers' }]} shortcuts="numbers">
        <QuestionnaireItem name="numbers">
          <QuestionnaireTitle>Numbers</QuestionnaireTitle>
          {numberChoices.map((choice, index) => (
            <QuestionnaireChoice key={choice.value} value={choice.value}>
              Number {index + 1}
            </QuestionnaireChoice>
          ))}
        </QuestionnaireItem>
      </Questionnaire>,
    );

    expect(screen.getByRole('radio', { name: 'Number 1' }).parentElement).toHaveAttribute('data-shortcut', '1');
    expect(screen.getByRole('radio', { name: 'Number 10' }).parentElement).not.toHaveAttribute('data-shortcut');
  });

  it('validates all enabled required questions before submitting a later default step', () => {
    const onSubmit = vi.fn();

    render(
      <Questionnaire
        defaultItem="last"
        items={[{ name: 'first', required: true }, { name: 'last' }]}
        onSubmit={onSubmit}
      >
        <QuestionnaireItem name="first" required>
          <QuestionnaireTitle>Required first question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Required first answer" />
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="last">
          <QuestionnaireTitle>Last question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Last answer" />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnaireSubmit>Submit</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('group', { name: 'Required first question' })).toBeVisible();
    expect(screen.getByRole('alert')).toHaveTextContent('Choose an answer to continue.');
  });

  it('clears skipped optional answers from form data', () => {
    render(
      <Questionnaire
        aria-label="Skip questionnaire"
        items={[
          { choices: [{ value: 'answer' }], name: 'first' },
          { choices: [{ value: 'next' }], name: 'second' },
        ]}
      >
        <QuestionnaireItem name="first">
          <QuestionnaireTitle>First question</QuestionnaireTitle>
          <QuestionnaireChoice value="answer">Answer</QuestionnaireChoice>
        </QuestionnaireItem>
        <QuestionnaireItem name="second">
          <QuestionnaireTitle>Second question</QuestionnaireTitle>
          <QuestionnaireChoice value="next">Next answer</QuestionnaireChoice>
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireSkip />
          <QuestionnaireNext />
        </QuestionnaireActions>
      </Questionnaire>,
    );

    fireEvent.click(screen.getByRole('radio', { name: 'Answer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));

    const form = screen.getByRole('form', { name: 'Skip questionnaire' });
    expect(new FormData(form).has('first')).toBe(false);
  });

  it('does not treat disabled freeform values as required answers', () => {
    const onSubmit = vi.fn();

    render(
      <Questionnaire
        aria-label="Disabled input questionnaire"
        items={[{ name: 'answer', required: true }]}
        onSubmit={onSubmit}
      >
        <QuestionnaireItem name="answer" required>
          <QuestionnaireTitle>Required answer</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Disabled answer" disabled value="Unavailable" />
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnaireSubmit>Submit</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>,
    );

    const form = screen.getByRole('form', { name: 'Disabled input questionnaire' });
    expect(new FormData(form).has('answer')).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Choose an answer to continue.');
  });

  it('clears a selected choice when it becomes disabled', () => {
    const onSubmit = vi.fn();

    function DisableChoiceQuestionnaire() {
      const [disabled, setDisabled] = React.useState(false);

      return (
        <Questionnaire
          aria-label="Dynamic choice questionnaire"
          items={[{ choices: [{ value: 'answer' }], name: 'answer', required: true }]}
          onSubmit={onSubmit}
        >
          <QuestionnaireItem name="answer" required>
            <QuestionnaireTitle>Required answer</QuestionnaireTitle>
            <QuestionnaireChoice disabled={disabled} value="answer">
              Answer
            </QuestionnaireChoice>
            <QuestionnaireError />
          </QuestionnaireItem>
          <button type="button" onClick={() => setDisabled(true)}>
            Disable answer
          </button>
          <QuestionnaireActions>
            <QuestionnaireSubmit>Submit</QuestionnaireSubmit>
          </QuestionnaireActions>
        </Questionnaire>
      );
    }

    render(<DisableChoiceQuestionnaire />);

    fireEvent.click(screen.getByRole('radio', { name: 'Answer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Disable answer' }));

    const form = screen.getByRole('form', { name: 'Dynamic choice questionnaire' });
    expect(new FormData(form).has('answer')).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Choose an answer to continue.');
  });

  it('preserves numeric defaults as required answers', () => {
    const onSubmit = vi.fn();

    render(
      <Questionnaire
        items={[{ name: 'quantity', required: true }]}
        onSubmit={(event) => {
          onSubmit(event);
          event.preventDefault();
        }}
      >
        <QuestionnaireItem name="quantity" required>
          <QuestionnaireTitle>Quantity</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Quantity answer" defaultValue={0} type="number" />
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnaireSubmit>Submit</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>,
    );

    expect(screen.getByRole('spinbutton', { name: 'Quantity answer' })).toHaveValue(0);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps file inputs uncontrolled while recognizing selected files as answers', () => {
    const onSubmit = vi.fn();
    const file = new File(['answer'], 'answer.txt', { type: 'text/plain' });

    render(
      <Questionnaire
        items={[{ name: 'attachment', required: true }]}
        onSubmit={(event) => {
          onSubmit(event);
          event.preventDefault();
        }}
      >
        <QuestionnaireItem name="attachment" required>
          <QuestionnaireTitle>Attachment</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Attachment file" type="file" />
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnaireSubmit>Submit</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>,
    );

    fireEvent.change(screen.getByLabelText('Attachment file'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
