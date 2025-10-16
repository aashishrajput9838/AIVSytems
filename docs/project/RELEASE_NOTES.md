# v0.1.0 – AI Response Validation MVP

## Highlights
- Firebase Auth (Email/Password + Google) with persistent sessions
- Protected dashboard route (requires login)
- Firestore-backed logs table (read, approve, reject)
- RouterProvider with React Router v7 future flags
- Env-based Firebase config via .env.local

## Setup
1) Create .env.local with Firebase keys
2) Enable Auth providers; create Firestore collection logs
3) Dev: npm run dev | Build: npm run build | Preview: npm run preview

## Firestore dev rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /logs/{doc} {
      allow read, write: if request.auth != null;
    }
  }
}

## Notable changes
- src/lib/firebase.js, src/lib/api.js, src/AuthProvider.jsx, src/pages/Login.jsx, src/Dashboard.jsx, src/router.jsx, src/App.jsx

