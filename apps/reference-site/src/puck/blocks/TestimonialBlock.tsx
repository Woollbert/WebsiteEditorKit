import type { ComponentConfig } from '@puckeditor/core';

export type TestimonialProps = {
  quote: string;
  attribution: string;
  attributionDetail: string;
  variant: 'card' | 'banner';
};

export const TestimonialBlock: ComponentConfig<TestimonialProps> = {
  fields: {
    quote: { type: 'textarea', label: 'Quote' },
    attribution: { type: 'text', label: 'Name' },
    attributionDetail: { type: 'text', label: 'Title or Context (e.g. "San Clemente, CA")' },
    variant: {
      type: 'select',
      label: 'Style',
      options: [
        { label: 'Card (boxed)', value: 'card' },
        { label: 'Banner (full-width)', value: 'banner' },
      ],
    },
  },
  defaultProps: {
    quote: 'A short, genuine quote from a customer about why they love what you do.',
    attribution: 'Customer Name',
    attributionDetail: 'San Clemente, CA',
    variant: 'card',
  },
  render: ({ quote, attribution, attributionDetail, variant }) => {
    if (variant === 'banner') {
      return (
        <section className="py-16 px-6" style={{ background: 'var(--color-ink)', color: 'var(--color-cream)' }}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-2xl md:text-3xl leading-relaxed mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              &ldquo;{quote}&rdquo;
            </p>
            <p className="font-semibold">{attribution}</p>
            {attributionDetail && (
              <p className="text-sm opacity-70 mt-1">{attributionDetail}</p>
            )}
          </div>
        </section>
      );
    }

    return (
      <section className="py-12 px-6">
        <div className="max-w-2xl mx-auto p-8 rounded-lg" style={{ background: 'var(--color-cream-soft)' }}>
          <p className="text-xl leading-relaxed mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            &ldquo;{quote}&rdquo;
          </p>
          <p className="font-semibold text-sm">{attribution}</p>
          {attributionDetail && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-soft)' }}>{attributionDetail}</p>
          )}
        </div>
      </section>
    );
  },
};
