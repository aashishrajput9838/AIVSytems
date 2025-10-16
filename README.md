# react-app

A React + Vite application.

## Organized app structure (high level)

```
src/
  app/               # App shell and router
  features/          # Feature modules (auth, dashboard, pages, analytics, validation)
  shared/            # Reusable UI + utilities
  services/          # API, firebase, and AI client
  hooks/             # Custom hooks
  styles/            # Global CSS (Tailwind v4)

docs/
  diagrams/          # Diagram files
  guides/            # Development guides
  project/           # Project documentation
  research/          # Research documents
  summaries/         # Implementation summaries

scripts/
  test/             # Test scripts
```

- Entry: `src/app/main.jsx`
- Router: `src/app/router.jsx`
- Global CSS: `src/styles/index.css`
- Documentation: `docs/` directory (see `docs/project/ORGANIZED_STRUCTURE.md` for full details)

## Scripts
- dev: `npm run dev`
- build: `npm run build`
- preview: `npm run preview`
- lint: `npm run lint`