# English Learning Materials

A minimal Vue + Vite static website for listing English learning materials.

This first version is designed for Azure Static Web Apps. It does not include a backend, database, login system, user uploads, or bundled document files. Real downloadable files should be hosted separately, such as in Azure Blob Storage, and referenced through `public/materials.json`.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Azure Static Web Apps Settings

- App location: `/`
- API location: leave blank
- Output location: `dist`
