import fs from 'fs'

const APIBaseURL='http://localhost:1337/api/'
const contentsFolderBasePath = './frontend/content'

const routesSettings = [
  {
    name: 'homepage',
    populate: ['highlight_medias', 'seo', 'seo.metaImage']
  },
  {
    name: 'about',
    populate: [
      'experience',
      'skills',
      'interests',
      'social_links',
      'seo',
      'seo.metaImage'
    ]
  },
  {
    name: 'shops-page',
    populate: ['shops_list', 'social_links', 'seo', 'seo.metaImage']
  },
  {
    name: 'projects-list-page',
    populate: ['seo', 'seo.metaImage']
  },
  {
    name: 'projects',
    multiple: true,
    findBy: 'slug',
    subfolder: 'projets',
    populate: [
      'cover_image_portrait',
      'cover_image_landscape',
      'skills',
      'main_images',
      'main_images.images',
      'typography',
      'typography.typo_visual',
      'colors',
      'secondary_images',
      'seo',
      'seo.metaImage'
    ]
  }
]

const destinationFilePath = (slug, subfolder) => {
  if (subfolder) return `${contentsFolderBasePath}/${subfolder}/${slug}.json`

  return `${contentsFolderBasePath}/${slug}.json`
}

const fetchSlug = async (route, slug) => {
  const endpoint = new URL(`${APIBaseURL}${route.name}`)
  
  route.populate?.forEach((populate, index) => {
    endpoint.searchParams.append(`populate[${index}]`, populate)
  })

  if (route.findBy) {
    endpoint.searchParams.append(`filters[${route.findBy}]`, slug)
  }

  await fetch(endpoint)
    .then(response => {
      if (response.status !== 200) return
      return response.json()
    })
    .then(async (response) => {
      const pageData = Array.isArray(response?.data) 
        ? response?.data?.[0]
        : response?.data
      if (!pageData) return

      const destinationFile = destinationFilePath(slug, route.subfolder)

      fs.writeFile(destinationFilePath(slug, route.subfolder), JSON.stringify(pageData), 'utf8', (error) => {
        if (error) {
          console.error(`Error writing to file ${destinationFile}`, error);
        } else {
          console.log(`Data written to file ${destinationFile}`);
        }
      });
    })
    .catch((error) => {
      console.log(error)
    })
}

routesSettings.forEach(async route => {
  if (route.subfolder && !fs.existsSync(`${contentsFolderBasePath}/${route.subfolder}`)){
    fs.mkdirSync(`${contentsFolderBasePath}/${route.subfolder}`);
  }

  if (route.multiple) {
    await fetch(`${APIBaseURL}${route.name}?fields[0]=slug`)
      .then(response => response.json())
      .then(response => {
        response.data?.forEach(slug => {
          if (!slug?.slug) return

          fetchSlug(route, slug?.slug)
        })
      })
    return
  }

  fetchSlug(route, route.name)
})