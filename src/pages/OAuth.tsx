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

    return (
        <div className="flex flex-col items-center p-5 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">OAuth Authentication</h1>
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
                {!code && scopes && (
                    <div className="w-full flex justify-center items-center">
                        <Button className="mt-4">
                            <Link to={oauth_url} className="block">
                                Autentica con Zoho
                            </Link>
                        </Button>
                    </div>
                )}
                {!error && code && (
                    <>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Code:
                            </label>
                            <TextInput
                                readOnly
                                value={code}
                            />
                        </div>
                        <div className="flex items-center">
                            {!response ? (
                                <>
                                    <Spinner
                                        aria-label="Fetching access token..."
                                        className="mr-2"
                                    />
                                    <p>Fetching Access Token...</p>
                                </>
                            ) : (
                                <div className="w-full flex flex-col gap-2">
                                    <Textarea
                                        value={JSON.stringify(response, null, 2)}
                                        rows={6}
                                    />
                                    <div className="w-full flex justify-center items-center gap-2">
                                        <CopyText textToCopy={JSON.stringify(response)} />
                                        <Button>
                                            <Link to="/request" className="block">
                                                Avanti
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
                {error && (
                    <>
                        <pre>{JSON.stringify(error)}</pre>
                        <Button className="mt-4">
                            <Link to="/" className="block">
                                Ripeti l'autenticazione
                            </Link>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default OAuth;