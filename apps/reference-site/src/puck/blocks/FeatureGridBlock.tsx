import type { ComponentConfig } from '@puckeditor/core';

export type Feature = {
  title: string;
  description: string;
  icon: string;
};

export type FeatureGridProps = {
  heading: string;
  columns: 2 | 3 | 4;
  features: Feature[];
};

export const FeatureGridBlock: ComponentConfig<FeatureGridProps> = {
  fields: {
    heading: { type: 'text', label: 'Section Heading' },
    columns: {
      type: 'select',
      label: 'Columns',
      options: [
        { label: '2 across', value: 2 },
        { label: '3 across', value: 3 },
        { label: '4 across', value: 4 },
      ],
    },
    features: {
      type: 'array',
      label: 'Features',
      arrayFields: {
        icon: { type: 'text', label: 'Icon (emoji or short text)' },
        title: { type: 'text', label: 'Feature Title' },
        description: { type: 'textarea', label: 'Feature Description' },
      },
      defaultItemProps: {
        icon: '✨',
        title: 'Feature title',
        description: 'A short description of what this feature does for the customer.',
      },
      getItemSummary: (item) => item.title || 'Untitled feature',
    },
  },
  defaultProps: {
    heading: 'What we offer',
    columns: 3,
    features: [
      { icon: '✂️', title: 'First feature', description: 'Describe the first thing you do well.' },
      { icon: '⭐', title: 'Second feature', description: 'Describe the second thing.' },
      { icon: '🎯', title: 'Third feature', description: 'And the third.' },
    ],
  },
  render: ({ heading, columns, features }) => {
    const gridClass =
      columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3';
    return (
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {heading && (
            <h2 className="text-3xl font-semibold text-center mb-10" style={{ fontFamily: 'var(--font-display)' }}>
              {heading}
            </h2>
          )}
          <div className={`grid ${gridClass} gap-8`}>
            {features?.map((f, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p style={{ color: 'var(--color-ink-soft)' }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
};
