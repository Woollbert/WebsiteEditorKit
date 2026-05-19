import type { ComponentConfig } from '@puckeditor/core';

export type SpacerProps = {
  size: 'sm' | 'md' | 'lg' | 'xl';
};

const heightFor = (s: SpacerProps['size']) =>
  ({ sm: '24px', md: '48px', lg: '96px', xl: '160px' }[s]);

export const SpacerBlock: ComponentConfig<SpacerProps> = {
  fields: {
    size: {
      type: 'select',
      label: 'Spacer Size',
      options: [
        { label: 'Small (24px)', value: 'sm' },
        { label: 'Medium (48px)', value: 'md' },
        { label: 'Large (96px)', value: 'lg' },
        { label: 'Extra Large (160px)', value: 'xl' },
      ],
    },
  },
  defaultProps: { size: 'md' },
  render: ({ size }) => <div style={{ height: heightFor(size) }} />,
};
