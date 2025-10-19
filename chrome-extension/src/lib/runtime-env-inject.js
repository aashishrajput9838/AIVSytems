// runtime-env-inject.js
// Use this script at build time (or as a tiny inline script) to inject runtime
// environment variables into the extension's window.__ENV__ object. This is
// useful because extension content/background scripts may not have access to
// import.meta.env at runtime.

(function injectRuntimeEnv() {
  try {
    const env = {
      VITE_FIREBASE_API_KEY: process?.env?.VITE_FIREBASE_API_KEY || '',
      VITE_FIREBASE_AUTH_DOMAIN: process?.env?.VITE_FIREBASE_AUTH_DOMAIN || '',
      VITE_FIREBASE_PROJECT_ID: process?.env?.VITE_FIREBASE_PROJECT_ID || '',
      VITE_FIREBASE_STORAGE_BUCKET: process?.env?.VITE_FIREBASE_STORAGE_BUCKET || '',
      VITE_FIREBASE_MESSAGING_SENDER_ID: process?.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      VITE_FIREBASE_APP_ID: process?.env?.VITE_FIREBASE_APP_ID || '',
      VITE_GEMINI_API_KEY: process?.env?.VITE_GEMINI_API_KEY || '',
      VITE_OPENAI_API_KEY: process?.env?.VITE_OPENAI_API_KEY || '',
      VITE_EMAILJS_SERVICE_ID: process?.env?.VITE_EMAILJS_SERVICE_ID || '',
      VITE_EMAILJS_TEMPLATE_ID: process?.env?.VITE_EMAILJS_TEMPLATE_ID || '',
      VITE_EMAILJS_PUBLIC_KEY: process?.env?.VITE_EMAILJS_PUBLIC_KEY || '',
    }

    // In a build script, replace process.env.* with build-time values, or
    // inject this file with a templating step. For ad-hoc injection, you can
    // include a small inline script in your extension's HTML that sets
    // window.__ENV__ = { ... }
    if (typeof window !== 'undefined') {
      window.__ENV__ = Object.assign(window.__ENV__ || {}, env)
    }
  } catch (err) {
    // no-op in build environments without `window`
  }
})()
