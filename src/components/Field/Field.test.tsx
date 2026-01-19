import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Input } from '../Input';
import { Field, FieldLabel, FieldDescription, FieldError, FieldGroup } from './Field';

describe('Field', () => {
  it('should render Field component to match snapshot', () => {
    const result = render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input placeholder="Email" />
      </Field>,
    );
    expect(result).toMatchSnapshot();
  });

  it('should render Field with description to match snapshot', () => {
    const result = render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input placeholder="Email" />
        <FieldDescription>Enter your email address</FieldDescription>
      </Field>,
    );
    expect(result).toMatchSnapshot();
  });

  it('should render Field with error to match snapshot', () => {
    const result = render(
      <Field data-invalid="true">
        <FieldLabel>Password</FieldLabel>
        <Input type="password" />
        <FieldError>Password is required</FieldError>
      </Field>,
    );
    expect(result).toMatchSnapshot();
  });

  it('should render horizontal Field to match snapshot', () => {
    const result = render(
      <FieldGroup>
        <Field orientation="horizontal">
          <FieldLabel>Enable</FieldLabel>
          <Input type="checkbox" />
        </Field>
      </FieldGroup>,
    );
    expect(result).toMatchSnapshot();
  });
});
