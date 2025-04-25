import { useActionState, useState } from 'react'
import { Button, Select, Spinner, Textarea, TextInput, ClipboardWithIconText } from 'flowbite-react';
import { actionRequest, methodOptions } from '@/utils';
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { Step } from '@/components';

const Request = () => {
    const data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data') || '') : null;
    const hasToken = localStorage.getItem('has_token') !== null;
    const [{ response }, formAction, isPending] = useActionState(actionRequest, {
        response: '',
        method: null,
        baseUrl: null,
        endpoint: null,
        body: null,
        headers: null,
        params: null,
    })
    const [method, setMethod] = useState('GET');
    const [baseURL, setBaseURL] = useState<string>(data?.api_domain || '');
    const [endpoint, setEndpoint] = useState<string>("");
    const [body, setBody] = useState<BodyInit | null>(null);
    const [params, setParams] = useState<{ key: string; value: string }[]>([]);
    const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        setLoading(true);
        setTimeout(() => {
            localStorage.clear();
            setLoading(false);
        }, 5000);
    };

    // Funzioni per i parametri
    const handleAddParam = () => setParams([...params, { key: '', value: '' }]);
    const handleRemoveParam = (index: number) => setParams(params.filter((_, i) => i !== index));
    const handleParamChange = (index: number, field: 'key' | 'value', value: string) => {
        const updatedParams = [...params];
        updatedParams[index][field] = value;
        setParams(updatedParams);
    };

    // Funzioni per gli headers
    const handleAddHeader = () => setHeaders([...headers, { key: '', value: '' }]);
    const handleRemoveHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index));
    const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
        const updatedHeaders = [...headers];
        updatedHeaders[index][field] = value;
        setHeaders(updatedHeaders);
    };

    if (!hasToken) {
        window.location.href = '/';
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner
                    aria-label="Logout..."
                />
            </div>
        )
    }

    return (
        <div className="p-5 bg-gray-100 min-h-screen">
            <div className="flex flex-col gap-4 justify-center items-center p-4 rounded-lg shadow-md bg-white">
                <form action={formAction} className='w-full flex flex-col gap-4 items-center justify-center'>
                    <Step index={3} />
                    <h1 className="text-2xl font-bold mb-4">Fetch Compiler</h1>
                    <hr className="w-full" />
                    <div>
                        <Link to="https://www.zoho.com/crm/developer/docs/api/" target="_blank" className="block">
                            <Button outline type="button">
                                Documentation Zoho API
                            </Button>
                        </Link>
                    </div>
                    <div className="w-full flex flex-col">

                        {/* Selezione Metodo */}
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Method:
                            </label>
                            <Select
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                className="w-full"
                                id="method"
                                name="method"
                                disabled={isPending}
                                required
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
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                BASE URL:
                            </label>
                            <TextInput
                                type="text"
                                id="baseUrl"
                                name="baseUrl"
                                disabled={isPending}
                                placeholder="Enter the BASE URL"
                                value={baseURL}
                                onChange={(e) => setBaseURL(e.target.value)}
                                required
                            />
                        </div>

                        {/* URL Textarea */}
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                ENDPOINT:
                            </label>
                            <TextInput
                                id="endpoint"
                                name="endpoint"
                                type="text"
                                disabled={isPending}
                                placeholder="Enter the request ENDPOINT URL"
                                value={endpoint}
                                onChange={(e) => setEndpoint(e.target.value)}
                                required
                            />
                        </div>

                    </div>

                    <hr className="w-full" />

                    <div className="w-full flex flex-col md:flex-row gap-2">
                        {/* Parameters */}
                        <div className="mb-4 md:w-1/2 w-full flex flex-col justify-start items-center">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Parameters:</label>
                            <Textarea
                                className="w-full mb-2 hidden"
                                id="params"
                                name="params"
                                readOnly
                                value={params.map(param => `${param.key}=${param.value}`).join('&')}
                            />
                            {params.map((param, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <TextInput
                                        disabled={isPending}
                                        placeholder="Key"
                                        value={param.key}
                                        onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                                    />
                                    <TextInput
                                        disabled={isPending}
                                        placeholder="Value"
                                        value={param.value}
                                        onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                                    />
                                    <Button type="button" color="gray" onClick={() => handleRemoveParam(index)}>
                                        <FaRegTrashCan className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" disabled={isPending} onClick={handleAddParam}>+ Add Parameter</Button>
                        </div>
                        {/* Headers */}
                        <div className="mb-4 md:w-1/2 w-full flex flex-col justify-start items-center">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Headers:</label>
                            <Textarea
                                className="w-full mb-2 hidden"
                                id="headers"
                                name="headers"
                                readOnly
                                value={JSON.stringify(headers)}
                            />
                            {headers.map((header, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <TextInput
                                        disabled={isPending}
                                        placeholder="Header Key"
                                        value={header.key}
                                        onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                                    />
                                    <TextInput
                                        disabled={isPending}
                                        placeholder="Header Value"
                                        value={header.value}
                                        onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                                    />
                                    <Button color="gray" onClick={() => handleRemoveHeader(index)}>
                                        <FaRegTrashCan className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" disabled={isPending} onClick={handleAddHeader}>+ Add Header</Button>
                        </div>

                    </div>

                    <hr className="w-full" />

                    <div className="w-full flex flex-col">

                        {/* Body JSON Textarea */}
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Body (JSON):
                            </label>
                            <Textarea
                                id="body"
                                name="body"
                                disabled={method === 'GET' || isPending}
                                required={method !== 'GET'}
                                placeholder='{"key": "value"}'
                                value={body?.toString() ?? ''}
                                onChange={(e) => setBody(e.target.value)}
                                rows={6}
                            />
                        </div>

                    </div>

                    <hr className="w-full" />

                    <div className='w-full md:w-1/2'>
                        {/* Fetch Button */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? <Spinner aria-label="Loading..." /> : 'Send Request'}
                            </Button>
                            <Button type="button" color="failure" onClick={handleLogout} className="w-full" disabled={isPending}>
                                Logout
                            </Button>
                        </div>
                    </div>

                </form>

                <hr className="w-full" />

                <div className="w-full flex flex-col">

                    {/* Response */}
                    <div className='relative flex gap-2 items-center justify-between mb-4'>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Response:
                        </label>
                        <ClipboardWithIconText valueToCopy={JSON.stringify(response)} />
                    </div>
                    <Textarea
                        className='w-full'
                        placeholder='Response will be shown here'
                        readOnly
                        value={response}
                        rows={12}
                    />
                </div>
            </div>
        </div>
    );
}

export default Request
