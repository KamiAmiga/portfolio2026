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
    })
  }
}
