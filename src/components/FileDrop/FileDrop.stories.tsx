import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Meta, StoryObj } from '@storybook/react';
import { ErrorCode } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '../Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../Form';
import { ScrollArea } from '../ScrollArea';
import { toast } from '../Toast';
import { FileDrop, FileDropArea, FileDropAreaText, FileDropFileArea } from './FileDrop';

function FileDropDemo() {
  return (
    <Card className="p-5">
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>Drag & Drop or Click Browse to Upload File</CardDescription>
      </CardHeader>
      <CardContent>
        <FileDrop>
          <FileDropArea>
            <FileDropAreaText className="cursor-pointer text-slate-700/30 underline">Browse</FileDropAreaText>
          </FileDropArea>
          <FileDropFileArea />
        </FileDrop>
      </CardContent>
    </Card>
  );
}

function AcceptFileTypeFileDropDemo() {
  return (
    <Card className="p-5">
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>Drag & Drop or Click Browse to Upload File</CardDescription>
      </CardHeader>
      <CardContent>
        <FileDrop
          accept={{
            'text/html': ['.html', '.htm'],
          }}
        >
          <FileDropArea>
            <FileDropAreaText className="text-slate-700/30">Only *.html and *.htm files accepted.</FileDropAreaText>
          </FileDropArea>
        </FileDrop>
      </CardContent>
    </Card>
  );
}

const file1 = new File(['file'], 'testfile.pdf', {
  type: 'application/pdf',
});
const file2 = new File(['file'], '123.pdf', {
  type: 'application/pdf',
});

const generateFiles = (count: number): File[] => {
  const list: File[] = [];
  for (let i = 0; i < count; i++) {
    list.push(
      new File(['file'], `file ${i}.pdf`, {
        type: 'application/pdf',
      }),
    );
  }
  return list;
};

function InitialFilesFileDropDemo() {
  const [state] = React.useState<File[]>([file1, file2]);
  return (
    <Card className="p-5">
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>Drag & Drop or Click Browse to Upload File</CardDescription>
      </CardHeader>
      <CardContent>
        <FileDrop files={state}>
          <FileDropArea>
            <FileDropAreaText className="text-slate-700/30">See preloaded files.</FileDropAreaText>
          </FileDropArea>
          <FileDropFileArea />
        </FileDrop>
      </CardContent>
    </Card>
  );
}

function DisabledFileDropDemo() {
  const [state] = React.useState<File[]>([file1, file2]);
  return (
    <Card className="p-5">
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>Field and Files are readonly. Files are still selectable</CardDescription>
      </CardHeader>
      <CardContent>
        <FileDrop disabled files={state}>
          <FileDropArea>
            <FileDropAreaText className="text-slate-700/30">See preloaded files.</FileDropAreaText>
          </FileDropArea>
          <FileDropFileArea />
        </FileDrop>
      </CardContent>
    </Card>
  );
}

function FileDropWithScrollAreaDemo() {
  const [state] = React.useState<File[]>(generateFiles(10));
  return (
    <Card className="p-5">
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>Field and Files are readonly. Files are still selectable</CardDescription>
      </CardHeader>
      <CardContent>
        <FileDrop disabled files={state}>
          <FileDropArea>
            <FileDropAreaText className="text-slate-700/30">See preloaded files.</FileDropAreaText>
          </FileDropArea>
          <ScrollArea className="h-36">
            <FileDropFileArea />
          </ScrollArea>
        </FileDrop>
      </CardContent>
    </Card>
  );
}

const formSchema = z.object({
  files: z.instanceof(File).array().min(1, 'Must add at least one file').max(2, 'No more than 2 files allowed.'),
});

function FileDropFormDemo() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: 'You submitted',
      description: `${values.files.length} file(s)`,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Files</FormLabel>
                <FormControl>
                  <FileDrop
                    {...field}
                    maxFiles={2}
                    onDropRejected={(files) => {
                      const messages: string[] = [];

                      files.forEach((file) => {
                        const msgs: string[] = [];
                        file.errors.forEach((m) => {
                          switch (m.code) {
                            case ErrorCode.FileInvalidType:
                            case ErrorCode.FileTooLarge:
                            case ErrorCode.FileTooSmall: {
                              msgs.push(m.message);
                              break;
                            }
                          }
                        });
                        const em = `${file.file.name}: ${msgs.join(' ')}`;
                        messages.push(em);
                      });
                      form.setError('files', { message: messages.join('\n') });
                    }}
                  >
                    <FileDropArea>
                      <FileDropAreaText className="text-slate-700/30">Add files to form.</FileDropAreaText>
                    </FileDropArea>
                    <FileDropFileArea />
                  </FileDrop>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

type ComponentType = React.ComponentProps<typeof FileDrop>;
const meta: Meta<ComponentType> = {
  component: FileDrop,
  render: FileDropDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};

export const AcceptFileTypesDemo: Story = {
  render: AcceptFileTypeFileDropDemo,
};

export const InitFileDrop: Story = {
  render: InitialFilesFileDropDemo,
};

export const DisabledFileDrop: Story = {
  render: DisabledFileDropDemo,
};

export const FileDropForm: Story = {
  render: FileDropFormDemo,
};

export const FileDropWithScrollArea: Story = {
  render: FileDropWithScrollAreaDemo,
};
