import { useState } from 'react'
import { Button, Select, Textarea } from 'flowbite-react';
import { methodOptions, SERVER_URL } from '@/utils';

const Request = () => {
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState<URL | null>(null);
    const [body, setBody] = useState<BodyInit | null>(null);
    const [response, setResponse] = useState('');

    const handleFetch = async () => {
        console.log('fetching', method, url, body);
        try {
            if (url) {
                const res = await fetch(`${SERVER_URL}/api/request`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        method,
                        url: url?.toString(),
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

    return (
        <div className="flex flex-col items-center p-5 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-5">Fetch Compiler</h1>
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">

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

                {/* Fetch Button */}
                <div className="w-full flex justify-stretch gap-2 items-center">
                    <Button onClick={handleFetch} className="w-full mb-4">
                        Send Request
                    </Button>
                    <Button color="failure" onClick={handleLogout} className="w-full mb-4">
                        Logout
                    </Button>
                </div>

                {/* Response */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Response:
                    </label>
                    <Textarea
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
