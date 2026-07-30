import type { StrapiImage } from "~/types/strapiResponsiveImage";

interface SeoData {
  metaTitle: string;
  metaDescription: string;
}

export const useSeoFromPageData = (seoData?: SeoData) => {
  if (seoData) {
    useSeoMeta({
      title: seoData.metaTitle,
      description: seoData.metaDescription,
      ogTitle: seoData.metaTitle ?? '',
      ogDescription: seoData.metaDescription ?? '',
      ogImage: 'https://www.cgicquel.fr/uploads/cover_Img01_c6b141a7b8.png'
    })
  }
}
