# react-app

A React application scaffolded with Vite.

## Requirements
- Node.js >= 18
- npm >= 9

## Getting Started

- Install dependencies:
```bash
npm install
```

- Start the dev server:
```bash
npm run dev
```

- Build for production:
```bash
npm run build
```

- Preview the production build:
```bash
npm run preview
```

## Project Structure
- `src/`: Application source code
- `index.html`: HTML entry
- `vite.config.ts` or `vite.config.js`: Vite configuration
- `public/`: Static assets (optional)

## Useful Links
- Vite Docs: https://vitejs.dev/
- React Docs: https://react.dev/
 - Firebase: https://firebase.google.com/docs

## Firebase Setup
Create a `.env.local` in project root with:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```
Then run:
```
npm run dev
```
