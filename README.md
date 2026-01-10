# 2026 version of my portfolio

My portfolio made with [Nuxt 4](https://nuxt.com/docs) and [Stapi 5](https://strapi.io/).

## Setup

Install the dependencies for both the frontend and backend:

```bash
npm run setup
```

## Access strapi admin

```bash
npm run dev:backend
```

or

```bash
cd backend
npm run dev
```

## Access Strapi contents to Nuxt frontend

1. Start strapi instance (using the above commands)

2. Extract strapi data as JSON files into the frontend app content folder, and copy the assets into the frontend app public folder:

```bash
npm run generate
```
