import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TextInput, Button } from 'flowbite-react'
import { ScopeSelector } from '@/components'

const Home = () => {
    const [clientId, setClientId] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [emptyScopes, setEmptyScopes] = useState(false);

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

        window.location.href = '/oauth';
    };

    return (
        <div className="flex flex-col items-center p-5 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">OAuth Setup</h1>
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
                <Button className="my-4">
                    <Link to="https://api-console.zoho.com/" className="block">
                        Vai alla Console di Zoho
                    </Link>
                </Button>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="client_id">
                        Client ID
                    </label>
                    <TextInput
                        id="client_id"
                        value={clientId || ''}
                        onChange={(e) => setClientId(e.target.value)}
                        placeholder="Inserisci Client ID"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="client_secret">
                        Client Secret
                    </label>
                    <TextInput
                        id="client_secret"
                        type="text"
                        value={clientSecret || ''}
                        onChange={(e) => setClientSecret(e.target.value)}
                        placeholder="Inserisci Client Secret"
                        required
                    />
                </div>

                <ScopeSelector onEmptyScopes={setEmptyScopes} />

                <Button onClick={handleSave} className="mt-4" disabled={clientId !== null && clientSecret !== null && emptyScopes}>
                    Avanti
                </Button>
            </div>
        </div>
    );
};

export default Home;
