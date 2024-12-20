import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Spinner, Textarea, TextInput } from 'flowbite-react';
import { REDIRECT_URI, SERVER_URL } from '@/utils';
import { CopyText } from '@/components';

const OAuth = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');
    const location = searchParams.get('location');
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<any | null>(null);

    const scopes = localStorage.getItem('scopes');

    const oauth_url = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${localStorage.getItem('client_id')}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${JSON.parse(scopes || '[]').join(',')}&access_type=offline`;

    useEffect(() => {
        if (code) {
            const fetchAccessToken = async () => {
                try {
                    const response = await fetch(`${SERVER_URL}/api/oauth`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            location: location!,
                            client_id: localStorage.getItem('client_id'),
                            client_secret: localStorage.getItem('client_secret'),
                            redirect_uri: REDIRECT_URI,
                            code: code!,
                        }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setResponse(data);
                        localStorage.setItem('refresh_token', data.refresh_token);
                        localStorage.setItem('api_domain', data.api_domain);
                        localStorage.setItem('location', location!);
                    } else {
                        setError(`Error fetching access token: ${response.statusText}`);
                    }
                } catch (error) {
                    setError(`Error fetching access token: ${JSON.stringify(error)}`);
                }
            };
            fetchAccessToken();
        }
    }, [code, location]);

    const handlePrev = () => {
        window.location.href = '/scope';
    };

    const handleReAuth = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <div className="flex flex-col items-center p-5 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">OAuth Authentication</h1>
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
                {!code && scopes && (
                    <div className="w-full flex flex-col justify-center items-center gap-4">
                        <Textarea
                            readOnly
                            value={oauth_url}
                            rows={8}
                        />
                        <div className='w-full flex justify-center items-center gap-4'>
                            <Link to={oauth_url} className="block">
                                <Button className="mt-4" disabled={!code && scopes.length === 0}>
                                    Authenticate
                                </Button>
                            </Link>
                            <Button onClick={handlePrev} className="mt-4">
                                Previous
                            </Button>
                        </div>
                    </div>
                )}
                {!error && code && (
                    <div className="w-full flex flex-col justify-center items-center gap-4">
                        <div className="w-full flex flex-col gap-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Code:
                            </label>
                            <TextInput
                                readOnly
                                value={code}
                            />
                        </div>
                        <div className="w-full flex flex-col gap-4 justify-center items-center">
                            {!response ? (
                                <>
                                    <Spinner
                                        aria-label="Fetching access token..."
                                        className="mr-2"
                                    />
                                    <p>Fetching Access Token...</p>
                                </>
                            ) : (
                                <div className="w-full flex flex-col gap-4 justify-center items-center">
                                    <Textarea
                                        value={JSON.stringify(response, null, 2)}
                                        readOnly
                                        rows={15}
                                    />
                                    <div className="w-full flex justify-center items-center gap-4">
                                        <CopyText textToCopy={JSON.stringify(response)} />
                                        <Link to="/request" className="block">
                                            <Button>
                                                Next
                                            </Button>
                                        </Link>
                                        <Button color="failure" onClick={handleReAuth}>
                                            Re-authenticate
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {error && (
                    <div className="w-full flex flex-col justify-center items-center gap-4">
                        <Textarea
                            value={JSON.stringify(error, null, 2)}
                            readOnly
                            rows={15}
                        />
                        <Button className="mt-4" color="failure" onClick={handleReAuth}>
                            Re-authenticate
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OAuth;