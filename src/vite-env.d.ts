/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string,
    readonly VITE_OPENWEATHER_API_KEY: string,
    readonly VITE_OPENWEATHER_API_BASE_URL: string
    // more env variables...
  }