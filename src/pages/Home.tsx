import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TextInput, Button } from 'flowbite-react'
import { CopyText } from '@/components'
import { REDIRECT_URI } from '@/utils';

const Home = () => {
    const [clientId, setClientId] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        const storedClientId = localStorage.getItem('client_id');
        const storedClientSecret = localStorage.getItem('client_secret');

        setClientId(storedClientId);
        setClientSecret(storedClientSecret);
    }, []);

    const handleSave = () => {
        if (!clientId || !clientSecret) {
            return;
        }
        localStorage.setItem('client_id', clientId);
        localStorage.setItem('client_secret', clientSecret);

        window.location.href = '/scope';
    };

    const handleCancel = () => {
        localStorage.removeItem('client_id');
        localStorage.removeItem('client_secret');
        setClientId(null);
        setClientSecret(null);
    };

    return (
        <div className="p-5 bg-gray-100 min-h-screen">
            <div className="flex flex-col gap-4 justify-center items-center p-4 rounded-lg shadow-md bg-white">
                <h1 className="text-3xl font-bold mb-4">OAuth Setup</h1>
                <hr className="w-full" />
                <div className="w-full flex flex-col lg:flex-row gap-4 lg:items-start justify-center items-center max-w-max p-6">
                    <div className="lg:w-1/2 w-full flex flex-col gap-4">
                        <p>
                            On the Zoho console, create a new project and get the Client ID and Client Secret. Enter <code>{REDIRECT_URI}</code> <CopyText icon textToCopy={REDIRECT_URI} /> as the Redirect URI .
                        </p>
                        <div>
                            <Link to="https://api-console.zoho.com/" target="_blank" className="block">
                                <Button color="gray">
                                    Go to Zoho API Console
                                </Button>
                            </Link>
                        </div>

                        <hr />

                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="client_id">
                                Client ID
                            </label>
                            <TextInput
                                id="client_id"
                                value={clientId || ''}
                                onChange={(e) => setClientId(e.target.value)}
                                placeholder="Insert Client ID"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="client_secret">
                                Client Secret
                            </label>
                            <TextInput
                                id="client_secret"
                                type="text"
                                value={clientSecret || ''}
                                onChange={(e) => setClientSecret(e.target.value)}
                                placeholder="Insert Client Secret"
                                required
                            />
                        </div>
                    </div>
                </div>

                <hr className="w-full" />

                <div className="w-full flex justify-center items-center gap-4">
                    <Button onClick={handleSave} className="mt-4" disabled={clientId === null && clientSecret === null}>
                        Next
                    </Button>
                    <Button color="gray" onClick={handleCancel} className="mt-4">
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Home;
