import { useState } from 'react'
import { Button, Select, Textarea, TextInput } from 'flowbite-react';
import { methodOptions, SERVER_URL } from '@/utils';

const Request = () => {
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState<URL | null>(null);
    const [body, setBody] = useState<BodyInit | null>(null);
    const [response, setResponse] = useState('');
    const [params, setParams] = useState<{ key: string; value: string }[]>([]);
    const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);

    const buildUrlWithParams = (baseUrl: string, params: { key: string; value: string }[]) => {
        const urlObj = new URL(baseUrl);
        params.forEach(({ key, value }) => {
            if (key) urlObj.searchParams.append(key, value);
        });
        return urlObj.toString();
    };

    // Funzione per costruire gli headers
    const buildHeaders = (headersArray: { key: string; value: string }[]) => {
        const headersObj: Record<string, string> = {};
        headersArray.forEach(({ key, value }) => {
            if (key) headersObj[key] = value;
        });
        return headersObj;
    };

    const handleFetch = async () => {
        console.log('fetching', method, url, body);
        try {
            if (url) {
                const fullUrl = buildUrlWithParams(url.toString(), params);
                const res = await fetch(`${SERVER_URL}/api/request`, {
                    method: 'POST',
                    headers: {
                        ...buildHeaders(headers),
                    },
                    body: JSON.stringify({
                        method,
                        url: fullUrl,
                        location: localStorage.getItem('location'),
                        refreshToken: localStorage.getItem('refresh_token'),
                        client_id: localStorage.getItem('client_id'),
                        client_secret: localStorage.getItem('client_secret'),
                        data: body,
                    }),
                });
                const data = await res.json();
                setResponse(JSON.stringify(data, null, 2));
            }
        } catch (error) {
            setResponse(`Error: ${JSON.stringify(error, null, 2)}`);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
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

    return (
        <div className="p-5 bg-gray-100 min-h-screen">
            <div className="flex flex-col gap-4 justify-center items-center p-4 rounded-lg shadow-md bg-white">
                <h1 className="text-2xl font-bold mb-4">Fetch Compiler</h1>
                <hr className="w-full" />
                <p className="!italic text-start">API Domain: {localStorage.getItem('api_domain')}</p>
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
                            URL:
                        </label>
                        <Textarea
                            placeholder="Enter the request URL"
                            value={url?.href}
                            onChange={(e) => setUrl(new URL(e.target.value))}
                            rows={3}
                        />
                    </div>
                </div>

                <hr className="w-full" />

                <div className="w-full flex flex-col md:flex-row">
                    {/* Parameters */}
                    <div className="mb-4 md:w-1/2 w-full flex flex-col justify-center items-center">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Parameters:</label>
                        {params.map((param, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <TextInput
                                    placeholder="Key"
                                    value={param.key}
                                    onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                                />
                                <TextInput
                                    placeholder="Value"
                                    value={param.value}
                                    onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                                />
                                <Button color="failure" onClick={() => handleRemoveParam(index)}>
                                    -
                                </Button>
                            </div>
                        ))}
                        <Button onClick={handleAddParam}>+ Add Parameter</Button>
                    </div>
                    {/* Headers */}
                    <div className="mb-4 md:w-1/2 w-full flex flex-col justify-center items-center">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Headers:</label>
                        {headers.map((header, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <TextInput
                                    placeholder="Header Key"
                                    value={header.key}
                                    onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                                />
                                <TextInput
                                    placeholder="Header Value"
                                    value={header.value}
                                    onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                                />
                                <Button color="failure" onClick={() => handleRemoveHeader(index)}>
                                    -
                                </Button>
                            </div>
                        ))}
                        <Button onClick={handleAddHeader}>+ Add Header</Button>
                    </div>

                </div>

                <hr className="w-full" />

                <div className="w-full flex flex-col">

                    {/* Body JSON Textarea */}
                    {method !== 'GET' && (
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Body (JSON):
                            </label>
                            <Textarea
                                placeholder='{"key": "value"}'
                                value={body?.toString() ?? ''}
                                onChange={(e) => setBody(e.target.value)}
                                rows={6}
                            />
                        </div>
                    )}

                </div>

                <hr className="w-full" />

                <div className='w-full md:w-1/2'>
                    {/* Fetch Button */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <Button onClick={handleFetch} className="w-full" disabled={!url}>
                            Send Request
                        </Button>
                        <Button color="failure" onClick={handleLogout} className="w-full">
                            Logout
                        </Button>
                    </div>
                </div>

                <hr className="w-full" />

                <div className="w-full flex flex-col">

                    {/* Response */}
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Response:
                    </label>
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
