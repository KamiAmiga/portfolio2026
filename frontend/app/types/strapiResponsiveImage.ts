export interface StrapiImageData {
  alternativeText: string;
  caption: string;
  ext: string;
  name: string;
  url: string;
  width: number;
  height: number;
}

export type CustomResponsiveFormats = "full_screen" | "projects_image"

export interface StrapiImage {
  id: number,
  attributes: StrapiImageData
}

