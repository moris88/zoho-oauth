import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config() // carica le variabili d'ambiente dal file .env

const SERVER_PORT = process.env.SERVER_PORT || 3001
const SERVER_AUTH = process.env.SERVER_AUTH || ''

const app = express()
app.use(cors()) // abilita CORS per il tuo server

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Middleware per autenticazione di base
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`)

  // Esempio: verifica header Authorization
  if (SERVER_AUTH && req.headers.authorization !== SERVER_AUTH) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  next() // passa al prossimo middleware o route
})

// Crea un endpoint proxy per l'OAuth
app.post('/api/oauth', async (req, res) => {
  const body = req.body
  console.log(body)
  try {
    const response = await fetch(
      `https://accounts.zoho.${body.location}/oauth/v2/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: body.grant_type,
          client_id: body.client_id,
          client_secret: body.client_secret,
          redirect_uri: body.redirect_uri,
          code: body.code,
        }).toString(),
      }
    )
      .then((res) => {
        console.log('res status', res.status)
        return getResponse(res)
      })
      .catch((err) => {
        console.log('ERROR:', err)
        return { status: 500, error: 'Internal Server Error' }
      })
    console.log(response)
    if (response?.error) {
      console.log('error', response.error)
      res.status(response?.status || 403).json({ error: response.error })
      return
    }
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post('/api/request', async (req, res) => {
  const body = req.body
  console.log(body)
  try {
    const accessToken = await fetch(
      `https://accounts.zoho.${body.location}/oauth/v2/token?refresh_token=${body.refreshToken}&client_id=${body.client_id}&client_secret=${body.client_secret}&grant_type=refresh_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => {
        console.log('fetch access token status', res.status)
        return getResponse(res)
      })
      .then((data) => {
        if (data?.error) {
          console.log('error', data.error)
          return { status: data?.status || 403, error: data.error }
        }
        return data?.access_token || null
      })
      .catch((err) => {
        console.log('ERROR:', err)
        return { status: 500, error: 'Internal Server Error' }
      })
    console.log('access_token', accessToken)
    if (accessToken) {
      const options = {
        method: body.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
      if (body.method !== 'GET')
        options.body = JSON.stringify({
          data: body.data,
        })
      const response = await fetch(body.url, options)
        .then((res) => {
          console.log('fetch status', res.status)
          return getResponse(res)
        })
        .catch((err) => {
          console.log('ERROR:', err)
          return { status: 500, error: 'Internal Server Error' }
        })
      console.log(response)
      if (response.error) {
        console.log('error', response.error)
        res.status(response.status).json({ error: response.error })
        return
      }
      res.status(200).json(response)
    } else if (accessToken?.error) {
      console.log('error', accessToken.error)
      res.status(accessToken.status).json({ error: accessToken.error })
    } else {
      console.log('error')
      res.status(403).json({ error: 'Forbidden' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`)
})

function getResponse(res) {
  if (res.status === 204) {
    return { status: res.status, warning: 'No Content' }
  }
  if (res.status === 400) {
    return { status: res.status, error: 'Bad Request' }
  }
  if (res.status === 401) {
    return {
      status: res.status,
      error: 'Unauthorized',
    }
  }
  if (res.status === 403) {
    return { status: res.status, error: 'Forbidden' }
  }
  if (res.status === 404) {
    return { status: res.status, error: 'Not Found' }
  }
  if (res.status === 408) {
    return { status: res.status, error: 'Request Timeout' }
  }
  if (res.status === 429) {
    return { status: res.status, error: 'Too Many Requests' }
  }
  if (res.status === 500) {
    return { status: res.status, error: 'Internal Server Error' }
  }
  if (res.status === 503) {
    return { status: res.status, error: 'Service Unavailable' }
  }
  if (res.status === 504) {
    return { status: res.status, error: 'Gateway Timeout' }
  }
  return res.json()
}
