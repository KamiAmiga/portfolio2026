import type { Schema, Struct } from '@strapi/strapi';

export interface AboutExperience extends Struct.ComponentSchema {
  collectionName: 'components_about_experiences';
  info: {
    displayName: 'Experience';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<['school', 'work']>;
    date: Schema.Attribute.String;
    name: Schema.Attribute.String;
    place: Schema.Attribute.String;
  };
}

export interface AboutInterest extends Struct.ComponentSchema {
  collectionName: 'components_about_interests';
  info: {
    displayName: 'Interest';
  };
  attributes: {
    icon_name: Schema.Attribute.String;
    name: Schema.Attribute.String;
  };
}

export interface AboutSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_about_social_links';
  info: {
    displayName: 'Social link';
  };
  attributes: {
    icon_name: Schema.Attribute.String;
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ProjectColor extends Struct.ComponentSchema {
  collectionName: 'components_project_colors';
  info: {
    displayName: 'Color';
  };
  attributes: {
    color_code: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 6;
        minLength: 6;
      }>;
    color_name: Schema.Attribute.String;
  };
}

export interface ProjectProjectMainImage extends Struct.ComponentSchema {
  collectionName: 'components_project_project_main_images';
  info: {
    description: '';
    displayName: 'Project main image';
  };
  attributes: {
    images: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    > &
      Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      [
        'ui-mobile_desktop',
        'ui-desktop',
        'ui-mobile',
        'design-print',
        'design-visual_id',
        'drawing',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface ProjectTypography extends Struct.ComponentSchema {
  collectionName: 'components_project_typographies';
  info: {
    displayName: 'Typography';
  };
  attributes: {
    typo_name: Schema.Attribute.String;
    typo_visual: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
  };
}

export interface SharedMetaSocial extends Struct.ComponentSchema {
  collectionName: 'components_shared_meta_socials';
  info: {
    displayName: 'metaSocial';
    icon: 'project-diagram';
  };
  attributes: {
    description: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 65;
      }>;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    socialNetwork: Schema.Attribute.Enumeration<['Facebook', 'Twitter']> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    metaRobots: Schema.Attribute.String;
    metaSocial: Schema.Attribute.Component<'shared.meta-social', true>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String;
    structuredData: Schema.Attribute.JSON;
  };
}

export interface ShopsShopItem extends Struct.ComponentSchema {
  collectionName: 'components_shops_shop_items';
  info: {
    description: '';
    displayName: 'Shop item';
  };
  attributes: {
    icon_name: Schema.Attribute.String;
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ShopsShopItemPreview extends Struct.ComponentSchema {
  collectionName: 'components_shops_shop_item_previews';
  info: {
    displayName: 'Shop item preview';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    link: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.experience': AboutExperience;
      'about.interest': AboutInterest;
      'about.social-link': AboutSocialLink;
      'project.color': ProjectColor;
      'project.project-main-image': ProjectProjectMainImage;
      'project.typography': ProjectTypography;
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
      'shops.shop-item': ShopsShopItem;
      'shops.shop-item-preview': ShopsShopItemPreview;
    }
  }
}
