import React from 'react'
import {
  Button,
  Select,
  Spinner,
  Textarea,
  TextInput,
  ClipboardWithIconText,
} from 'flowbite-react'
import { actionRequest, methodOptions } from '@/utils'
import { FaRegTrashCan } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { Step } from '@/components'

function Request() {
  const data = localStorage.getItem('data')
    ? JSON.parse(localStorage.getItem('data') || '')
    : null
  const hasToken = localStorage.getItem('has_token') !== null
  const [{ response }, formAction, isPending] = React.useActionState(
    actionRequest,
    {
      response: '',
      method: null,
      baseUrl: null,
      endpoint: null,
      body: null,
      headers: null,
      params: null,
    }
  )
  const [method, setMethod] = React.useState('GET')
  const [baseURL, setBaseURL] = React.useState<string>(data?.api_domain || '')
  const [endpoint, setEndpoint] = React.useState<string>('')
  const [body, setBody] = React.useState<BodyInit | null>(null)
  const [params, setParams] = React.useState<{ key: string; value: string }[]>(
    []
  )
  const [headers, setHeaders] = React.useState([
    { key: 'Content-Type', value: 'application/json' },
  ])
  const [loading, setLoading] = React.useState(false)

  const handleLogout = () => {
    setLoading(true)
    setTimeout(() => {
      localStorage.clear()
      setLoading(false)
    }, 3000)
  }

  // Funzioni per i parametri
  const handleAddParam = () => setParams([...params, { key: '', value: '' }])
  const handleRemoveParam = (index: number) =>
    setParams(params.filter((_, i) => i !== index))
  const handleParamChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const updatedParams = [...params]
    updatedParams[index][field] = value
    setParams(updatedParams)
  }

  // Funzioni per gli headers
  const handleAddHeader = () => setHeaders([...headers, { key: '', value: '' }])
  const handleRemoveHeader = (index: number) =>
    setHeaders(headers.filter((_, i) => i !== index))
  const handleHeaderChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const updatedHeaders = [...headers]
    updatedHeaders[index][field] = value
    setHeaders(updatedHeaders)
  }

  if (!hasToken) {
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner aria-label="Logout..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-4 shadow-md">
        <form
          action={formAction}
          className="flex w-full flex-col items-center justify-center gap-4"
        >
          <Step index={3} />
          <h1 className="mb-4 text-2xl font-bold">Fetch Compiler</h1>
          <hr className="w-full" />
          <div>
            <Link
              className="block"
              target="_blank"
              to="https://www.zoho.com/crm/developer/docs/api/"
            >
              <Button outline type="button">
                Documentation Zoho API
              </Button>
            </Link>
          </div>
          <div className="flex w-full flex-col">
            {/* Selezione Metodo */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Method:
              </label>
              <Select
                required
                className="w-full"
                disabled={isPending}
                id="method"
                name="method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                {methodOptions.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </Select>
            </div>

            {/* URL Textarea */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                BASE URL:
              </label>
              <TextInput
                required
                disabled={isPending}
                id="baseUrl"
                name="baseUrl"
                placeholder="Enter the BASE URL"
                type="text"
                value={baseURL}
                onChange={(e) => setBaseURL(e.target.value)}
              />
            </div>

            {/* URL Textarea */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                ENDPOINT:
              </label>
              <TextInput
                required
                disabled={isPending}
                id="endpoint"
                name="endpoint"
                placeholder="Enter the request ENDPOINT URL"
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
              />
            </div>
          </div>

          <hr className="w-full" />

          <div className="flex w-full flex-col gap-2 md:flex-row">
            {/* Parameters */}
            <div className="mb-4 flex w-full flex-col items-center justify-start md:w-1/2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Parameters:
              </label>
              <Textarea
                readOnly
                className="mb-2 hidden w-full"
                id="params"
                name="params"
                value={params
                  .map((param) => `${param.key}=${param.value}`)
                  .join('&')}
              />
              {params.map((param, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <TextInput
                    disabled={isPending}
                    placeholder="Key"
                    value={param.key}
                    onChange={(e) =>
                      handleParamChange(index, 'key', e.target.value)
                    }
                  />
                  <TextInput
                    disabled={isPending}
                    placeholder="Value"
                    value={param.value}
                    onChange={(e) =>
                      handleParamChange(index, 'value', e.target.value)
                    }
                  />
                  <Button
                    color="gray"
                    type="button"
                    onClick={() => handleRemoveParam(index)}
                  >
                    <FaRegTrashCan className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                disabled={isPending}
                type="button"
                onClick={handleAddParam}
              >
                + Add Parameter
              </Button>
            </div>
            {/* Headers */}
            <div className="mb-4 flex w-full flex-col items-center justify-start md:w-1/2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Headers:
              </label>
              <Textarea
                readOnly
                className="mb-2 hidden w-full"
                id="headers"
                name="headers"
                value={JSON.stringify(headers)}
              />
              {headers.map((header, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <TextInput
                    disabled={isPending}
                    placeholder="Header Key"
                    value={header.key}
                    onChange={(e) =>
                      handleHeaderChange(index, 'key', e.target.value)
                    }
                  />
                  <TextInput
                    disabled={isPending}
                    placeholder="Header Value"
                    value={header.value}
                    onChange={(e) =>
                      handleHeaderChange(index, 'value', e.target.value)
                    }
                  />
                  <Button
                    color="gray"
                    onClick={() => handleRemoveHeader(index)}
                  >
                    <FaRegTrashCan className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                disabled={isPending}
                type="button"
                onClick={handleAddHeader}
              >
                + Add Header
              </Button>
            </div>
          </div>

          <hr className="w-full" />

          <div className="flex w-full flex-col">
            {/* Body JSON Textarea */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Body (JSON):
              </label>
              <Textarea
                disabled={method === 'GET' || isPending}
                id="body"
                name="body"
                placeholder='{"key": "value"}'
                required={method !== 'GET'}
                rows={6}
                value={body?.toString() ?? ''}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          </div>

          <hr className="w-full" />

          <div className="w-full md:w-1/2">
            {/* Fetch Button */}
            <div className="flex flex-col gap-4 md:flex-row">
              <Button className="w-full" disabled={isPending} type="submit">
                {isPending ? (
                  <Spinner aria-label="Loading..." />
                ) : (
                  'Send Request'
                )}
              </Button>
              <Button
                className="w-full"
                color="failure"
                disabled={isPending}
                type="button"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </form>

        <hr className="w-full" />

        <div className="flex w-full flex-col">
          {/* Response */}
          <div className="relative mb-4 flex items-center justify-between gap-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Response:
            </label>
            <ClipboardWithIconText valueToCopy={JSON.stringify(response)} />
          </div>
          <Textarea
            readOnly
            className="w-full"
            placeholder="Response will be shown here"
            rows={12}
            value={response}
          />
        </div>
      </div>
    </div>
  )
}

export default Request
