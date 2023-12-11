/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import escapeHtml from 'escape-html';
import { Descendant, Editor, Node, Element as SlateElement, Text, Transforms } from 'slate';
import { RenderElementProps, RenderLeafProps, RenderPlaceholderProps } from 'slate-react';

import { CustomEditor, CustomElement } from './RichText.types';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

export const serializeToPlainText = (nodes: Node[]): string => {
  if (!nodes?.length) return '';
  return nodes.map((n) => (Node.isNode(n) ? Node.string(n) : '')).join('\n');
};

const _serialize = (node: Descendant): string => {
  if (Text.isText(node)) {
    let str = escapeHtml(node.text);
    if (node.bold) str = `<strong>${str}</strong>`;
    if (node.italic) str = `<em>${str}</em>`;
    if (node.code) str = `<pre><code>${str}</code></pre>`;
    if (node.underline) str = `<u>${str}</u>`;
    return str;
  }

  const children = node.children?.map((n) => _serialize(n as any)).join('');

  switch (node.type) {
    case 'block-quote':
      return `<blockquote>${children}</blockquote>`;
    case 'bulleted-list':
      return `<ul>${children}</ul>`;
    case 'numbered-list':
      return `<ol>${children}</ol>`;
    case 'list-item':
      return `<li>${children}</li>`;
    case 'h1':
      return `<h1>${children}</h1>`;
    case 'h2':
      return `<h2>${children}</h2>`;
    case 'h3':
      return `<h3>${children}</h3>`;
    case 'h4':
      return `<h4>${children}</h4>`;
    case 'h5':
      return `<h5>${children}</h5>`;
    case 'h6':
      return `<h6>${children}</h6>`;
    default:
      return `<p>${children}</p>`;
  }
};
export const serializeToHTML = (nodes: Node[]): string => {
  if (!nodes?.length) return '';
  const result = nodes.map((n) => (Node.isNode(n) ? _serialize(n as any) : '')).join('');
  return result ? `<span data-testid='slate-serialized-html'>${result}</span>` : '';
};

export const isMarkActive = (editor: CustomEditor, format: string): boolean => {
  const marks = Editor.marks(editor) as { [key: string]: any };
  return marks ? marks[format] === true : false;
};

export const isBlockActive = (editor: CustomEditor, format: string): boolean => {
  const blockType = TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type';
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
    }),
  );

  return !!match;
};

export const isFormatActive = (editor: CustomEditor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => {
      const t = n as any;
      return t[format] === true;
    },
    mode: 'all',
  });
  return !!match;
};

export const toggleMark = (editor: CustomEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const toggleBlock = (editor: CustomEditor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });

  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : (format as any),
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : (format as any),
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block: CustomElement = { type: format as any, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export const toggleFormat = (editor: CustomEditor, format: string) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(editor, { [format]: isActive ? null : true }, { match: Text.isText, split: true });
};

export const renderElement = (props: RenderElementProps): JSX.Element => {
  const style = { textAlign: props.element.align };
  switch (props.element.type) {
    case 'block-quote':
      return (
        <blockquote
          dir={props.element.align === 'left' ? 'ltr' : props.element.align === 'right' ? 'rtl' : props.attributes.dir}
          style={style}
          {...props.attributes}
        >
          {props.children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul style={style} {...props.attributes}>
          {props.children}
        </ul>
      );
    case 'numbered-list':
      return (
        <ol style={style} {...props.attributes}>
          {props.children}
        </ol>
      );
    case 'list-item':
      return (
        <li style={style} {...props.attributes}>
          {props.children}
        </li>
      );
    case 'h1':
      return (
        <h1 style={style} {...props.attributes}>
          {props.children}
        </h1>
      );
    case 'h2':
      return (
        <h2 style={style} {...props.attributes}>
          {props.children}
        </h2>
      );
    case 'h3':
      return (
        <h3 style={style} {...props.attributes}>
          {props.children}
        </h3>
      );
    case 'h4':
      return (
        <h4 style={style} {...props.attributes}>
          {props.children}
        </h4>
      );
    case 'h5':
      return (
        <h5 style={style} {...props.attributes}>
          {props.children}
        </h5>
      );
    case 'h6':
      return (
        <h6 style={style} {...props.attributes}>
          {props.children}
        </h6>
      );
    case 'code':
      return (
        <pre {...props.attributes}>
          <code>{props.children}</code>
        </pre>
      );
    default:
      return (
        <p style={style} {...props.attributes}>
          {props.children}
        </p>
      );
  }
};

export const renderLeaf = (props: RenderLeafProps): JSX.Element => {
  if (props.leaf.bold) props.children = <strong>{props.children}</strong>;
  if (props.leaf.italic) props.children = <em>{props.children}</em>;
  if (props.leaf.code) props.children = <code>{props.children}</code>;
  if (props.leaf.underline) props.children = <u>{props.children}</u>;
  return <span {...props.attributes}>{props.children}</span>;
};

export const renderPlaceholder = (props: RenderPlaceholderProps): JSX.Element => {
  return <p {...props.attributes}>{props.children}</p>;
};
