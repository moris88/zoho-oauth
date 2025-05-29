import React from 'react'
import { Link } from 'react-router-dom'
import { TextInput, Button, Spinner, ClipboardWithIcon } from 'flowbite-react'
import { actionHome, REDIRECT_URI } from '@/utils'
import { Step } from '@/components'

function Home() {
  const hasToken = localStorage.getItem('has_token') !== null
  const [{ clientId, clientSecret }, formAction, isPending] =
    React.useActionState(actionHome, {
      clientId: localStorage.getItem('client_id') ?? '',
      clientSecret: localStorage.getItem('client_secret') ?? '',
    })

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner aria-label="Fetching data..." />
      </div>
    )
  }

  if (hasToken) {
    window.location.href = '/request'
  }

  return (
    <div className="min-h-screen p-5">
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-gray-800 p-4 shadow-md">
        <Step index={-1} />
        <h1 className="mb-4 text-3xl font-bold">OAuth Setup</h1>
        <hr className="w-full" />
        <div className="flex w-full flex-col items-center justify-center gap-4 p-6 lg:flex-row lg:items-start">
          <div className="flex w-full flex-col gap-4 lg:w-1/2">
            <p>
              On the Zoho console, create a new project and get the Client ID
              and Client Secret.
            </p>
            <div className="flex w-full items-center justify-center gap-4">
              <Link
                className="block"
                target="_blank"
                to="https://api-console.zoho.com/"
              >
                <Button color="primary" type="button">
                  Go to Zoho API Console
                </Button>
              </Link>
            </div>
            <p>
              Enter <code>{REDIRECT_URI}</code> as the Redirect URI. <br />
              Click <code>Add Client</code>,{' '}
              <code>Server-based Applications</code> and enter:
              <ul>
                <li>
                  -<code>Client Name</code>
                </li>
                <li>
                  -<code>Homepage URL</code>
                </li>
                <li>
                  -<code>Authorized Redirect URIs</code>
                </li>
              </ul>
            </p>
            <div className="relative flex w-full items-center justify-center gap-4">
              <TextInput
                readOnly
                defaultValue={REDIRECT_URI}
                id="redirectUri"
                name="redirectUri"
                type="text"
              />
              <ClipboardWithIcon valueToCopy={REDIRECT_URI} />
            </div>
          </div>
        </div>

        <hr className="w-full" />

        <form action={formAction} className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <div className="w-full lg:w-1/2">
              <label
                className="block text-sm font-medium text-gray-200"
                htmlFor="client_id"
              >
                Client ID
              </label>
              <TextInput
                required
                autoComplete="off"
                defaultValue={clientId}
                id="clientId"
                name="clientId"
                placeholder="Insert Client ID"
                type="text"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <label
                className="block text-sm font-medium text-gray-200"
                htmlFor="client_secret"
              >
                Client Secret
              </label>
              <TextInput
                required
                autoComplete="off"
                defaultValue={clientSecret}
                id="clientSecret"
                name="clientSecret"
                placeholder="Insert Client Secret"
                type="text"
              />
            </div>
          </div>

          <hr className="w-full" />

          <div className="flex w-full items-center justify-center gap-4">
            <Button
              className="mt-4"
              color="primary"
              disabled={isPending}
              type="submit"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Home
