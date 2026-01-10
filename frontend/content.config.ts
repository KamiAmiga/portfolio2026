import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const strapiImageSchema = z.object({
  id: z.number(),
  attributes: z.object({
    alternativeText: z.string(),
    caption: z.string(),
    ext: z.string(),
    name: z.string(),
    url: z.string(),
    width: z.number(),
    height: z.number()
  })
})

const jsonRichtextTextNode = z.object({
  type: z.enum(['text']),
  text: z.string(),
  bold: z.optional(z.boolean()),
  italic: z.optional(z.boolean()),
  underline: z.optional(z.boolean()),
  strikethrough: z.optional(z.boolean()),
  code: z.optional(z.boolean()),
})

const jsonRichtextLinkNode = z.object({
  type: z.enum(['link']),
  url: z.string(),
  children: z.array(jsonRichtextTextNode)
})

const jsonRichtextInlineNode = z.union([jsonRichtextTextNode, jsonRichtextLinkNode])

const jsonRichTextParagraphNode = z.object({
  type: z.enum(['paragraph']),
  children: z.array(jsonRichtextInlineNode)
})

const seoSchema = z.object({
  metaTitle: z.string(),
  metaDescription: z.string(),
  metaImage: z.object({
    data: strapiImageSchema
  })
})

const linkSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  icon_name: z.string()
})

const skillSchema = z.object({
  id: z.number(),
  attributes: z.object({
    name: z.string(),
    level: z.number(),
    category: z.string(),
    icon_name: z.string()
  })
})

const homeSchema = z.object({
  title: z.string(),
  highlight_medias: z.object({
    data: z.array(strapiImageSchema)
  }),
  subtitle: z.string(),
  seo: seoSchema
})

const aboutSchema = z.object({
  intro: z.array(jsonRichTextParagraphNode),
  experience: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      date: z.string(),
      place: z.nullable(z.string()),
      category: z.string()
    })
  ),
  skills: z.object({
    data: z.array(skillSchema)
  }),
  interests: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      icon_name: z.string()
    })
  ),
  social_links: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      url: z.string(),
      icon_name: z.string()
    })
  ),
  seo: seoSchema
})

const projectsListSchema = z.object({
  title: z.string(),
  seo: seoSchema
})

const shopsSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  shops_list: z.array(linkSchema),
  social_links: z.array(linkSchema),
  seo: seoSchema
})

const projectSchema = z.object({
  slug: z.string(),
  name: z.string(),
  year: z.number(),
  description: z.array(jsonRichTextParagraphNode),
  main_images: z.array(
    z.object({
      id: z.number(),
      images: z.object({
        id: z.number(),
        data: z.array(strapiImageSchema)
      }),
      type: z.enum([
        "ui-mobile_desktop",
        "ui-desktop",
        "ui-mobile",
        "design-print",
        "design-visual_id",
        "drawing"
      ])
    })
  ),
  typography: z.array(
    z.object({
      id: z.number(),
      typo_name: z.string(),
      typo_visual: z.object({
        data: strapiImageSchema
      })
    })
  ),
  colors: z.array(z.object({
    id: z.number(),
    color_code: z.string(),
    color_name: z.string()
  })),
  secondary_images: z.object({
    data: z.array(strapiImageSchema)
  }),
  skills: z.object({
    data: z.array(skillSchema)
  }),
  cover_image_portrait: z.object({
    data: strapiImageSchema
  }),
  cover_image_landscape: z.object({
    data: strapiImageSchema
  }),
  seo: seoSchema
})

export default defineContentConfig({
  collections: {
    home: defineCollection({
      source: 'homepage.json',
      type: 'page',
      schema: homeSchema
    }),
    about: defineCollection({
      source: 'about.json',
      type: 'page',
      schema: aboutSchema
    }),
    projectsList: defineCollection({
      source: 'projects-list-page.json',
      type: 'page',
      schema: projectsListSchema
    }),
    shops: defineCollection({
      source: 'shops-page.json',
      type: 'page',
      schema: shopsSchema
    }),
    projects: defineCollection({
      source: 'projets/*.json',
      type: 'page',
      schema: projectSchema
    }),
  }
})
