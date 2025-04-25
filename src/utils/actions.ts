import { SERVER_URL } from './metadata'
import { buildHeaders, buildUrlWithParams } from './utils'

export function actionHome(
  prevState: {
    clientId: string | null
    clientSecret: string | null
  },
  queryData: any
) {
  const clientId = queryData.get('clientId')
  const clientSecret = queryData.get('clientSecret')
  if (clientId && clientSecret) {
    localStorage.setItem('client_id', clientId)
    localStorage.setItem('client_secret', clientSecret)

    window.location.href = '/scope'
  }
  return {
    ...prevState,
    clientId,
    clientSecret,
  }
}

export function actionScope(
  prevState: {
    scopes: string | null
  },
  queryData: any
) {
  const scopes = queryData.get('scopes')
  if (scopes) {
    localStorage.setItem('scopes', scopes)
    window.location.href = '/oauth'
  }
  return {
    ...prevState,
    scopes,
  }
}

export async function actionGenerateToken(
  prevState: {
    clientId: string | null
    clientSecret: string | null
    locationDomain: string | null
    code: string | null
    redirect_uri: string | null
    grant_type: string | null
    response: string | null
    error: string | null
  },
  queryData: any
) {
  try {
    const clientId = queryData.get('client_id')
    const clientSecret = queryData.get('client_secret')
    const locationDomain = queryData.get('location_domain')
    const code = queryData.get('code')
    const redirectUri = queryData.get('redirect_uri')
    const response = await fetch(`${SERVER_URL}/api/oauth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: locationDomain,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code,
      }),
    })
    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('has_token', 'true')
      localStorage.setItem('data', JSON.stringify(data))
      return {
        ...prevState,
        response: data,
        error: null,
      }
    } else {
      return {
        ...prevState,
        error: `Error fetching response: ${response.statusText}`,
      }
    }
  } catch (error) {
    return {
      ...prevState,
      error: `Error fetching response: ${error}`,
    }
  }
}

export async function actionOAuth(
  prevState: {
    base_url: string | null
    response_type: 'code' | null
    clientId: string | null
    redirect_uri: string | null
    scopes: string | null
    accessType: 'offline' | 'online' | null
    location: string | null
  },
  queryData: any
) {
  const baseUrl = queryData.get('base_url')
  const responseType = queryData.get('response_type')
  const clientId = queryData.get('client_id')
  const redirectUri = queryData.get('redirect_uri')
  const scopes = queryData.get('scopes')
  const accessType = queryData.get('access_type')
  const location = queryData.get('location_domain')
  const oauthUrl = `${baseUrl}?response_type=${responseType}&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${scopes}&access_type=${accessType}`

  if (location) {
    localStorage.setItem('location_domain', location)

    window.location.href = oauthUrl
  }

  return {
    ...prevState,
  }
}

export async function actionRequest(
  prevState: {
    response: string | null
    method: string | null
    baseUrl: string | null
    endpoint: string | null
    body: string | null
    headers: string | null
    params: string | null
  },
  queryData: any
) {
  const method = queryData.get('method')
  const baseUrl = queryData.get('baseUrl')
  const endpoint = queryData.get('endpoint')
  const body = queryData.get('body')
  const headers = queryData.get('headers')
  const params = queryData.get('params')
  try {
    if (baseUrl && endpoint) {
      const url = buildUrlWithParams(new URL(endpoint, baseUrl), params)
      const res = await fetch(`${SERVER_URL}/api/request`, {
        method: 'POST',
        headers: {
          ...buildHeaders(headers),
        },
        body: JSON.stringify({
          method,
          url,
          location: localStorage.getItem('location'),
          refreshToken: localStorage.getItem('refresh_token'),
          client_id: localStorage.getItem('client_id'),
          client_secret: localStorage.getItem('client_secret'),
          data: body,
        }),
      })
      const data = await res.json()
      return {
        ...prevState,
        method,
        baseUrl,
        endpoint,
        body,
        headers,
        params,
        response: JSON.stringify(data, null, 2),
      }
    } else {
      return {
        ...prevState,
        method,
        baseUrl,
        endpoint,
        body,
        headers,
        params,
        response: 'Please provide a valid URL and endpoint.',
      }
    }
  } catch (error) {
    return {
      ...prevState,
      method,
      baseUrl,
      endpoint,
      body,
      headers,
      params,
      response: `Error: ${error}`,
    }
  }
}
