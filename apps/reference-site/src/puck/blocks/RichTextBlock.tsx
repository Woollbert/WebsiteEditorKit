import type { ComponentConfig } from '@puckeditor/core';

export type RichTextProps = {
  content: string;
  maxWidth: 'narrow' | 'medium' | 'wide';
};

const widthClass = (w: RichTextProps['maxWidth']) =>
  ({ narrow: 'max-w-xl', medium: 'max-w-2xl', wide: 'max-w-4xl' }[w]);

export const RichTextBlock: ComponentConfig<RichTextProps> = {
  fields: {
    content: { type: 'textarea', label: 'Body Text' },
    maxWidth: {
      type: 'select',
      label: 'Max Width',
      options: [
        { label: 'Narrow', value: 'narrow' },
        { label: 'Medium', value: 'medium' },
        { label: 'Wide', value: 'wide' },
      ],
    },
  },
  defaultProps: {
    content:
      'Write a paragraph here. This block is a simple text block with three width options. For richer formatting (headings, lists, links), use multiple stacked RichTextBlocks or add a markdown variant in your custom block library.',
    maxWidth: 'medium',
  },
  render: ({ content, maxWidth }) => (
    <section className={`py-10 px-6 ${widthClass(maxWidth)} mx-auto`}>
      <div className="prose prose-lg" style={{ color: 'var(--color-ink)' }}>
        {content.split('\n\n').map((para, i) => (
          <p key={i} className="mb-4">{para}</p>
        ))}
      </div>
    </section>
  ),
};
