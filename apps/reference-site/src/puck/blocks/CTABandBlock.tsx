import type { ComponentConfig } from '@puckeditor/core';

export type CTABandProps = {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  background: 'cream' | 'ink' | 'gold';
};

const styleFor = (bg: CTABandProps['background']) => {
  if (bg === 'ink') return { background: 'var(--color-ink)', color: 'var(--color-cream)' };
  if (bg === 'gold') return { background: 'var(--color-gold)', color: 'var(--color-ink)' };
  return { background: 'var(--color-cream-soft)', color: 'var(--color-ink)' };
};

const btnStyleFor = (bg: CTABandProps['background']) => {
  if (bg === 'gold') return { background: 'var(--color-ink)', color: 'var(--color-cream)' };
  return { background: 'var(--color-gold)', color: 'var(--color-ink)' };
};

export const CTABandBlock: ComponentConfig<CTABandProps> = {
  fields: {
    heading: { type: 'text', label: 'Headline' },
    body: { type: 'textarea', label: 'Supporting Text' },
    ctaLabel: { type: 'text', label: 'Button Label' },
    ctaHref: { type: 'text', label: 'Button URL' },
    background: {
      type: 'select',
      label: 'Background Color',
      options: [
        { label: 'Cream (light)', value: 'cream' },
        { label: 'Ink (dark)', value: 'ink' },
        { label: 'Gold', value: 'gold' },
      ],
    },
  },
  defaultProps: {
    heading: 'Ready to get started?',
    body: 'A short line that prompts the visitor to take action.',
    ctaLabel: 'Get in touch',
    ctaHref: '/contact',
    background: 'cream',
  },
  render: ({ heading, body, ctaLabel, ctaHref, background }) => (
    <section className="px-6 py-16" style={styleFor(background)}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          {heading}
        </h2>
        <p className="text-lg mb-6 opacity-90">{body}</p>
        <a href={ctaHref} className="inline-block px-6 py-3 rounded font-medium" style={btnStyleFor(background)}>
          {ctaLabel}
        </a>
      </div>
    </section>
  ),
};
