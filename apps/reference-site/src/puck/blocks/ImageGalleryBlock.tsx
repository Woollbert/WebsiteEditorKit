import type { ComponentConfig } from '@puckeditor/core';

export type GalleryImage = {
  url: string;
  caption?: string;
  alt: string;
};

export type ImageGalleryProps = {
  heading: string;
  columns: 2 | 3 | 4;
  images: GalleryImage[];
};

export const ImageGalleryBlock: ComponentConfig<ImageGalleryProps> = {
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
    images: {
      type: 'array',
      label: 'Images',
      arrayFields: {
        url: { type: 'text', label: 'Image URL' },
        alt: { type: 'text', label: 'Alt Text (for accessibility)' },
        caption: { type: 'text', label: 'Caption (optional)' },
      },
      defaultItemProps: { url: '', alt: '', caption: '' },
      getItemSummary: (item) => item.alt || item.caption || 'Image',
    },
  },
  defaultProps: {
    heading: 'Gallery',
    columns: 3,
    images: [
      { url: '', alt: 'First image', caption: '' },
      { url: '', alt: 'Second image', caption: '' },
      { url: '', alt: 'Third image', caption: '' },
    ],
  },
  render: ({ heading, columns, images }) => {
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
          <div className={`grid ${gridClass} gap-4`}>
            {images?.map((img, i) => (
              <figure key={i}>
                {img.url ? (
                  <img src={img.url} alt={img.alt} className="w-full h-auto rounded-md object-cover aspect-square" />
                ) : (
                  <div className="w-full aspect-square rounded-md" style={{ background: 'var(--color-cream-soft)' }} />
                )}
                {img.caption && (
                  <figcaption className="mt-2 text-sm text-center" style={{ color: 'var(--color-ink-soft)' }}>
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  },
};
