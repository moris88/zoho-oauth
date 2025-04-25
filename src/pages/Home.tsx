import { useActionState } from 'react'
import { Link } from 'react-router-dom'
import { TextInput, Button, Spinner, ClipboardWithIconText } from 'flowbite-react'
import { actionHome, REDIRECT_URI } from '@/utils';
import { Step } from '@/components';

const Home = () => {
    const hasToken = localStorage.getItem('has_token') !== null;
    const [{ clientId, clientSecret }, formAction, isPending] = useActionState(actionHome, {
        clientId: localStorage.getItem('client_id') || '',
        clientSecret: localStorage.getItem('client_secret') || '',
    });

    if (isPending) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner
                    aria-label="Fetching data..."
                />
            </div>
        )
    }

    if (hasToken) {
        window.location.href = '/request';
    }

    return (
        <div className="p-5 bg-gray-100 min-h-screen">
            <div className="flex flex-col gap-4 justify-center items-center p-4 rounded-lg shadow-md bg-white">
                <Step index={-1} />
                <h1 className="text-3xl font-bold mb-4">OAuth Setup</h1>
                <hr className="w-full" />
                <div className="w-full flex flex-col lg:flex-row gap-4 lg:items-start justify-center items-center p-6">
                    <div className="lg:w-1/2 w-full flex flex-col gap-4">
                        <p>
                            On the Zoho console, create a new project and get the Client ID and Client Secret.
                        </p>
                        <div className='w-full flex justify-center items-center gap-4'>
                            <Link to="https://api-console.zoho.com/" target="_blank" className="block">
                                <Button outline type="button">
                                    Go to Zoho API Console
                                </Button>
                            </Link>
                        </div>
                        <p>
                            Enter <code>{REDIRECT_URI}</code> as the Redirect URI. <br/>Click <code>Add Client</code>, <code>Server-based Applications</code> and enter:
                            <ul>
                                <li>-<code>Client Name</code></li>
                                <li>-<code>Homepage URL</code></li>
                                <li>-<code>Authorized Redirect URIs</code></li>
                            </ul>
                        </p>
                        <div className='relative w-full flex justify-center items-center gap-4'>
                            <TextInput
                                id="redirectUri"
                                name='redirectUri'
                                readOnly
                                type="text"
                                defaultValue={REDIRECT_URI}
                            />
                            <ClipboardWithIconText valueToCopy={REDIRECT_URI} label="Copy" />
                        </div>
                        
                    </div>
                </div>

                <hr className="w-full" />

                <form action={formAction} className="w-full flex flex-col gap-4">
                    <div className="w-full flex flex-col justify-center items-center gap-4">
                        <div className="lg:w-1/2 w-full">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="client_id">
                                Client ID
                            </label>
                            <TextInput
                                id="clientId"
                                name='clientId'
                                autoComplete='off'
                                defaultValue={clientId}
                                type="text"
                                placeholder="Insert Client ID"
                                required
                            />
                        </div>
    
                        <div className="lg:w-1/2 w-full">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="client_secret">
                                Client Secret
                            </label>
                            <TextInput
                                id="clientSecret"
                                name='clientSecret'
                                autoComplete='off'
                                defaultValue={clientSecret}
                                type="text"
                                placeholder="Insert Client Secret"
                                required
                            />
                        </div>
                    </div>

                    <hr className="w-full" />

                    <div className="w-full flex justify-center items-center gap-4">
                        <Button type="submit" className="mt-4" disabled={isPending}>
                            Next
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Home;
