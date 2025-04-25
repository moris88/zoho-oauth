export const REDIRECT_URI =
  import.meta.env.VITE_REDIRECT_URI || 'http://localhost:3000/oauth'
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'
export const BASE_URL_OAUTH = 'https://accounts.zoho.com/oauth/v2/auth'
export const methodOptions = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
export const listDomains = ['com', 'eu', 'in', 'us']
