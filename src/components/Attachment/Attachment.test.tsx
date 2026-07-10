import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from './Attachment';

describe('Attachment', () => {
  it('composes file metadata, actions, and upload state', () => {
    const { container } = render(
      <Attachment state="uploading" size="sm">
        <AttachmentMedia>PDF</AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>report.pdf</AttachmentTitle>
          <AttachmentDescription>Uploading</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove report.pdf">×</AttachmentAction>
        </AttachmentActions>
        <AttachmentTrigger aria-label="Preview report.pdf" />
      </Attachment>,
    );

    expect(screen.getByText('report.pdf')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove report.pdf' })).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('data-state', 'uploading');
    expect(container.firstChild).toHaveAttribute('data-size', 'sm');
  });

  it('renders a polymorphic trigger', () => {
    render(
      <Attachment>
        <AttachmentTrigger asChild>
          <a href="/report.pdf">Open report</a>
        </AttachmentTrigger>
      </Attachment>,
    );
    expect(screen.getByRole('link', { name: 'Open report' })).toHaveAttribute('href', '/report.pdf');
  });
});
