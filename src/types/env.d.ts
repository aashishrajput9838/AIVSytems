/// <reference types="vite/client" />

// Environment variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_ANALYTICS_ID: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global types
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any
    analytics?: {
      track: (event: string, properties?: Record<string, any>) => void
      identify: (userId: string, traits?: Record<string, any>) => void
      page: (name: string, properties?: Record<string, any>) => void
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      VITE_API_URL: string
      VITE_FIREBASE_API_KEY: string
      VITE_FIREBASE_AUTH_DOMAIN: string
      VITE_FIREBASE_PROJECT_ID: string
      VITE_FIREBASE_STORAGE_BUCKET: string
      VITE_FIREBASE_MESSAGING_SENDER_ID: string
      VITE_FIREBASE_APP_ID: string
      VITE_ANALYTICS_ID: string
      VITE_APP_VERSION: string
      VITE_APP_ENV: 'development' | 'staging' | 'production'
    }
  }
}

// CSS Modules
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.sass' {
  const classes: { [key: string]: string }
  export default classes
}

// Images and assets
declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}

declare module '*.ico' {
  const content: string
  export default content
}

declare module '*.bmp' {
  const content: string
  export default content
}

// JSON modules
declare module '*.json' {
  const value: any
  export default value
}

// React component types
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}

export {}
