import type { ComponentConfig } from '@puckeditor/core';

export type HeroProps = {
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaHref: string;
  variant: 'centered' | 'split' | 'full-bleed';
  imageUrl?: string;
};

export const HeroBlock: ComponentConfig<HeroProps> = {
  fields: {
    heading: { type: 'text', label: 'Headline' },
    subheading: { type: 'textarea', label: 'Subhead' },
    ctaLabel: { type: 'text', label: 'CTA Button Text' },
    ctaHref: { type: 'text', label: 'CTA Link URL' },
    variant: {
      type: 'select',
      label: 'Layout Variant',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Split (image right)', value: 'split' },
        { label: 'Full Bleed (background image)', value: 'full-bleed' },
      ],
    },
    imageUrl: {
      type: 'text',
      label: 'Image URL',
    },
  },
  defaultProps: {
    heading: 'Your headline goes here',
    subheading: 'A short, punchy line that explains what you do.',
    ctaLabel: 'Get in touch',
    ctaHref: '/contact',
    variant: 'centered',
    imageUrl: '',
  },
  render: ({ heading, subheading, ctaLabel, ctaHref, variant, imageUrl }) => {
    if (variant === 'split') {
      return (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                {heading}
              </h1>
              <p className="text-lg mb-6" style={{ color: 'var(--color-ink-soft)' }}>{subheading}</p>
              <a href={ctaHref} className="inline-block px-6 py-3 rounded font-medium" style={{ background: 'var(--color-gold)', color: 'var(--color-ink)' }}>
                {ctaLabel}
              </a>
            </div>
            {imageUrl ? (
              <img src={imageUrl} alt="" className="rounded-lg w-full h-auto" />
            ) : (
              <div className="rounded-lg w-full aspect-square" style={{ background: 'var(--color-cream-soft)' }} />
            )}
          </div>
        </section>
      );
    }

    if (variant === 'full-bleed') {
      return (
        <section
          className="py-24 px-6 text-center text-white"
          style={{
            backgroundImage: imageUrl ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${imageUrl})` : 'linear-gradient(rgba(22,17,11,0.85), rgba(22,17,11,0.85))',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              {heading}
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">{subheading}</p>
            <a href={ctaHref} className="inline-block px-7 py-3 rounded font-medium" style={{ background: 'var(--color-gold)', color: 'var(--color-ink)' }}>
              {ctaLabel}
            </a>
          </div>
        </section>
      );
    }

    return (
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            {heading}
          </h1>
          <p className="text-lg mb-6" style={{ color: 'var(--color-ink-soft)' }}>{subheading}</p>
          <a href={ctaHref} className="inline-block px-6 py-3 rounded font-medium" style={{ background: 'var(--color-gold)', color: 'var(--color-ink)' }}>
            {ctaLabel}
          </a>
        </div>
      </section>
    );
  },
};
