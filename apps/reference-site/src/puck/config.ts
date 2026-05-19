import type { Config } from '@puckeditor/core';
import { HeroBlock, type HeroProps } from './blocks/HeroBlock';
import { RichTextBlock, type RichTextProps } from './blocks/RichTextBlock';
import { CTABandBlock, type CTABandProps } from './blocks/CTABandBlock';
import { FeatureGridBlock, type FeatureGridProps } from './blocks/FeatureGridBlock';
import { ImageGalleryBlock, type ImageGalleryProps } from './blocks/ImageGalleryBlock';
import { TestimonialBlock, type TestimonialProps } from './blocks/TestimonialBlock';
import { ContactInfoBlock, type ContactInfoProps } from './blocks/ContactInfoBlock';
import { SpacerBlock, type SpacerProps } from './blocks/SpacerBlock';

export type Props = {
  Hero: HeroProps;
  RichText: RichTextProps;
  CTABand: CTABandProps;
  FeatureGrid: FeatureGridProps;
  ImageGallery: ImageGalleryProps;
  Testimonial: TestimonialProps;
  ContactInfo: ContactInfoProps & { _data?: any };
  Spacer: SpacerProps;
};

export const puckConfig: Config<Props> = {
  components: {
    Hero: HeroBlock,
    RichText: RichTextBlock,
    CTABand: CTABandBlock,
    FeatureGrid: FeatureGridBlock,
    ImageGallery: ImageGalleryBlock,
    Testimonial: TestimonialBlock,
    ContactInfo: ContactInfoBlock,
    Spacer: SpacerBlock,
  },
  categories: {
    layout: {
      title: 'Layout',
      components: ['Hero', 'CTABand', 'Spacer'],
    },
    content: {
      title: 'Content',
      components: ['RichText', 'FeatureGrid', 'Testimonial'],
    },
    media: {
      title: 'Media',
      components: ['ImageGallery'],
    },
    data: {
      title: 'Data-Driven',
      components: ['ContactInfo'],
    },
  },
};
