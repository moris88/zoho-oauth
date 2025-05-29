import React from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Button,
  Select,
  Spinner,
  Textarea,
  TextInput,
  ClipboardWithIcon,
} from 'flowbite-react'
import {
  actionGenerateToken,
  actionOAuth,
  BASE_URL_OAUTH,
  listDomains,
  REDIRECT_URI,
} from '@/utils'
import { Step } from '@/components'

function OAuth() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

  const [, formActionOauth, isPending] = React.useActionState(actionOAuth, {
    base_url: null,
    response_type: null,
    clientId: null,
    redirect_uri: null,
    scopes: null,
    accessType: null,
    location: null,
  })

  const [{ response, error }, formActionToken, isLoadingToken] =
    React.useActionState(actionGenerateToken, {
      clientId: null,
      clientSecret: null,
      locationDomain: null,
      code: null,
      redirect_uri: null,
      grant_type: null,
      response: null,
      error: null,
    })

  const scopes = localStorage.getItem('scopes')
  const clientId = localStorage.getItem('client_id')
  const clientSecret = localStorage.getItem('client_secret')
  const locationDomain = localStorage.getItem('location_domain')

  if (!clientId) {
    window.location.href = '/'
  }
  if (!scopes) {
    window.location.href = '/scope'
  }

  if (isPending || isLoadingToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner aria-label="Fetching data..." />
      </div>
    )
  }

  if (error) {
    return (
      <>
        <pre>{JSON.stringify(error, null, 3)}</pre>
        <Button
          className="mt-4"
          color="failure"
          onClick={() => {
            localStorage.removeItem('location_domain')
            window.location.href = '/'
          }}
        >
          Re-authenticate
        </Button>
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-5">
      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-gray-800 p-6 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold">
          OAuth Authentication
        </h1>
        {!code && !locationDomain ? (
          <form
            action={formActionOauth}
            className="flex w-full flex-col items-center justify-center gap-4"
          >
            <Step index={1} />
            <div className="flex w-full flex-col items-center justify-center gap-4 lg:w-1/2">
              <div className="flex w-full items-center justify-between gap-4">
                <span className="max-w-36 min-w-36">{'Base url'}: </span>
                <TextInput
                  readOnly
                  required
                  className="w-full"
                  id="base_url"
                  name="base_url"
                  type="text"
                  value={BASE_URL_OAUTH}
                />
              </div>
              <div className="flex w-full items-center justify-between gap-4">
                <span className="max-w-36 min-w-36">{'Response type'}: </span>
                <TextInput
                  readOnly
                  required
                  className="w-full"
                  id="response_type"
                  name="response_type"
                  type="text"
                  value={'code'}
                />
              </div>
              <div className="flex w-full items-center justify-between gap-4">
                <span className="max-w-36 min-w-36">{'Client id'}: </span>
                <TextInput
                  readOnly
                  required
                  className="w-full"
                  id="client_id"
                  name="client_id"
                  type="text"
                  value={clientId ?? ''}
                />
              </div>
              <div className="flex w-full items-center justify-between gap-4">
                <span className="max-w-36 min-w-36">{'Redirect uri'}: </span>
                <TextInput
                  readOnly
                  required
                  className="w-full"
                  id="redirect_uri"
                  name="redirect_uri"
                  type="text"
                  value={REDIRECT_URI}
                />
              </div>
              <div className="flex w-full items-center justify-between gap-4">
                <span className="max-w-36 min-w-36">{'Scopes'}: </span>
                <TextInput
                  readOnly
                  required
                  className="w-full"
                  id="scopes"
                  name="scopes"
                  type="text"
                  value={scopes ?? ''}
                />
              </div>
            </div>

            <div className="flex w-full items-center gap-4">
              <label
                className="max-w-36 min-w-36 text-sm font-medium text-gray-200"
                htmlFor="access_type"
              >
                Access Type:
              </label>
              <Select
                required
                className="w-full"
                defaultValue={'offline'}
                id="access_type"
                name="access_type"
              >
                <option value={'offline'}>offline</option>
                <option value={'online'}>online</option>
              </Select>
            </div>

            <div className="flex w-full items-center gap-4">
              <label
                className="max-w-36 min-w-36 text-sm font-medium text-gray-200"
                htmlFor="location_domain"
              >
                Location:
              </label>
              <Select
                required
                className="w-full"
                defaultValue="com"
                id="location_domain"
                name="location_domain"
              >
                {listDomains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain.toUpperCase()}
                  </option>
                ))}
              </Select>
            </div>

            <hr className="w-full" />

            <div className="flex w-full items-center justify-center gap-4">
              <Button
                className="mt-4"
                color="secondary"
                type="button"
                onClick={() => (window.location.href = '/scope')}
              >
                Previous
              </Button>
              <Button
                className="mt-4"
                color="primary"
                disabled={isPending}
                type="submit"
              >
                {isPending ? (
                  <Spinner aria-label="Loading..." />
                ) : (
                  'Authenticate'
                )}
              </Button>
            </div>
          </form>
        ) : code && locationDomain ? (
          <form
            action={formActionToken}
            className="flex w-full flex-col items-center justify-center gap-4"
          >
            <Step index={2} />
            <div className="flex w-full flex-col items-center justify-center gap-4 lg:w-1/2">
              <div className="flex w-full items-center justify-between gap-4">
                <span className="max-w-36 min-w-36">{'Code'}: </span>
                <TextInput
                  readOnly
                  required
                  className="w-full"
                  id="code"
                  name="code"
                  type="text"
                  value={code || ''}
                />
              </div>
              <div className="flex w-full items-center justify-between gap-4">
                <span className="max-w-36 min-w-36">{'Client id'}: </span>
                <TextInput
                  readOnly
                  required
                  className="w-full"
                  id="client_id"
                  name="client_id"
                  type="text"
                  value={clientId || ''}
                />
              </div>
              <div className="flex w-full items-center justify-between gap-4">
                <span className="max-w-36 min-w-36">{'Client secret'}: </span>
                <TextInput
                  readOnly
                  required
                  className="w-full"
                  id="client_secret"
                  name="client_secret"
                  type="text"
                  value={clientSecret || ''}
                />
              </div>
              <div className="flex w-full items-center justify-between gap-4">
                <span className="max-w-36 min-w-36">{'Location'}: </span>
                <TextInput
                  readOnly
                  required
                  className="w-full"
                  id="location_domain"
                  name="location_domain"
                  type="text"
                  value={locationDomain || ''}
                />
              </div>
              <div className="flex w-full items-center justify-between gap-4">
                <span className="max-w-36 min-w-36">{'Redirect uri'}: </span>
                <TextInput
                  readOnly
                  required
                  className="w-full"
                  id="redirect_uri"
                  name="redirect_uri"
                  type="text"
                  value={REDIRECT_URI}
                />
              </div>
              <div className="flex w-full items-center justify-between gap-4">
                <span className="max-w-36 min-w-36">{'Grant type'}: </span>
                <TextInput
                  readOnly
                  required
                  className="w-full"
                  id="grant_type"
                  name="grant_type"
                  type="text"
                  value={'authorization_code'}
                />
              </div>
            </div>

            <hr className="w-full" />

            {!response && (
              <div className="flex w-full items-center justify-center gap-4">
                <Button
                  color="failure"
                  type="button"
                  onClick={() => (window.location.href = '/')}
                >
                  Re-authenticate
                </Button>
                <Button color="primary" type="submit">
                  Generate Token
                </Button>
              </div>
            )}

            {response && (
              <div className="flex w-full flex-col items-center justify-center gap-4">
                <div className="flex w-full flex-col items-center justify-center gap-4">
                  <div className="flex w-full flex-col gap-4">
                    <label htmlFor="response">Response:</label>
                    <Textarea
                      readOnly
                      id="response"
                      name="response"
                      rows={15}
                      value={JSON.stringify(response, null, 2)}
                    />
                  </div>
                  <div className="relative flex w-full items-center justify-center gap-4">
                    <ClipboardWithIcon valueToCopy={JSON.stringify(response)} />
                    <Button
                      color="failure"
                      type="button"
                      onClick={() => (window.location.href = '/')}
                    >
                      Re-authenticate
                    </Button>
                    <Button
                      color="primary"
                      type="button"
                      onClick={() => (window.location.href = '/request')}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        ) : (
          <div className="flex items-center justify-center">
            <Spinner aria-label="Fetching data..." />
          </div>
        )}
      </div>
    </div>
  )
}

export default OAuth
