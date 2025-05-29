import React from 'react'
import { Button, Spinner, Textarea } from 'flowbite-react'
import { ScopeSelector, Step } from '@/components'
import { actionScope } from '@/utils'

function Scope() {
  const [emptyScopes, setEmptyScopes] = React.useState(true)
  const [{ scopes }, formAction, isPending] = React.useActionState(
    actionScope,
    {
      scopes: localStorage.getItem('scopes') || '',
    }
  )

  const [enterScopes, setEnterScopes] = React.useState<string>(
    scopes || localStorage.getItem('scopes') || ''
  )
  const clientId = localStorage.getItem('client_id')
  const clientSecret = localStorage.getItem('client_secret')

  if (!clientId || !clientSecret) {
    window.location.href = '/'
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner aria-label="Fetching data..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <form
        action={formAction}
        className="flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-white p-4 shadow-md"
      >
        <Step index={0} />
        <h1 className="mb-4 text-3xl font-bold">Select Scopes</h1>

        <hr className="w-full" />

        <div className="w-full lg:w-1/2">
          <div className="flex w-full flex-col items-center justify-center gap-4 p-6 lg:flex-row lg:items-start">
            <div className="flex w-full flex-col gap-4">
              <ScopeSelector
                onChangeScopes={(scopes) => setEnterScopes(scopes.join(','))}
                onEmptyScopes={setEmptyScopes}
              />
            </div>
          </div>
        </div>

        <hr className="w-full" />

        <div className="w-full lg:w-1/2">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="scopes"
          >
            List Scopes
          </label>
          <Textarea
            required
            defaultValue={enterScopes}
            id="scopes"
            name="scopes"
            rows={4}
          />
        </div>

        <hr className="w-full" />

        <div className="flex w-full items-center justify-center gap-4">
          <Button
            color="gray"
            type="button"
            onClick={() => (window.location.href = '/')}
          >
            Previous
          </Button>
          <Button disabled={emptyScopes || isPending} type="submit">
            Next
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Scope
