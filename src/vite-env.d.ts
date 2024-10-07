/// <reference types="vite/client" />

export interface ImportMetaEnv {
  VITE_REDIRECT_URI: string
}

export interface ImportMeta {
    env: ImportMetaEnv
}
