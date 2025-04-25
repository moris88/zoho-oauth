import { useActionState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Select, Spinner, Textarea, TextInput, ClipboardWithIconText } from 'flowbite-react';
import { actionGenerateToken, actionOAuth, BASE_URL_OAUTH, listDomains, REDIRECT_URI } from '@/utils';
import { Step } from '@/components';

const OAuth = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    const [, formActionOauth, isPending] = useActionState(actionOAuth, {
        base_url: null,
        response_type: null,
        clientId: null,
        redirect_uri: null,
        scopes: null,
        accessType: null,
        location: null,
    })

    const [{ response, error }, formActionToken, isLoadingToken] = useActionState(actionGenerateToken, {
        clientId: null,
        clientSecret: null,
        locationDomain: null,
        code: null,
        redirect_uri: null,
        grant_type: null,
        response: null,
        error: null,
    })

    const scopes = localStorage.getItem('scopes');
    const clientId = localStorage.getItem('client_id');
    const clientSecret = localStorage.getItem('client_secret');
    const locationDomain = localStorage.getItem('location_domain');

    if (!clientId) {
        window.location.href = '/';
    }
    if (!scopes) {
        window.location.href = '/scope';
    }

    if (isPending || isLoadingToken) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner
                    aria-label="Fetching data..."
                />
            </div>
        )
    }

    if (error) {
        return (
            <>
                <pre>{JSON.stringify(error, null, 3)}</pre>
                <Button className="mt-4" color="failure" onClick={() => {
                    localStorage.removeItem('location_domain');
                    window.location.href = '/'
                }}>
                    Re-authenticate
                </Button>
            </>
        )
    }

    return (
        <div className="flex flex-col items-center p-5 bg-gray-100 min-h-screen">
            <div className="w-full bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold mb-4 text-center">OAuth Authentication</h1>
                <div className='lg:w-1/2 w-full'>
                    {(!code && !locationDomain) ? (
                        <form action={formActionOauth} className="w-full flex flex-col justify-center items-center gap-4">
                            <Step index={1} />
                            <div className="w-full flex items-center justify-between gap-4">
                                <span className='min-w-36 max-w-36'>{'Base url'}: </span>
                                <TextInput id="base_url" name="base_url" className='w-full' type="text" readOnly value={BASE_URL_OAUTH} required />
                            </div>
                            <div className="w-full flex items-center justify-between gap-4">
                                <span className='min-w-36 max-w-36'>{'Response type'}: </span>
                                <TextInput id="response_type" name="response_type" className='w-full' type="text" readOnly value={'code'} required />
                            </div>
                            <div className="w-full flex items-center justify-between gap-4">
                                <span className='min-w-36 max-w-36'>{'Client id'}: </span>
                                <TextInput id="client_id" name="client_id" className='w-full' type="text" readOnly value={clientId || ''} required />
                            </div>
                            <div className="w-full flex items-center justify-between gap-4">
                                <span className='min-w-36 max-w-36'>{'Redirect uri'}: </span>
                                <TextInput id="redirect_uri" name="redirect_uri" className='w-full' type="text" readOnly value={REDIRECT_URI} required />
                            </div>
                            <div className="w-full flex items-center justify-between gap-4">
                                <span className='min-w-36 max-w-36'>{'Scopes'}: </span>
                                <TextInput id="scopes" name="scopes" className='w-full' type="text" readOnly value={scopes || ''} required />
                            </div>

                            <div className="w-full flex items-center gap-4">
                                <label htmlFor='access_type' className="min-w-36 max-w-36 text-sm font-medium text-gray-700">
                                    Access Type:
                                </label>
                                <Select id="access_type" name="access_type" className="w-full" defaultValue={'offline'} required>
                                    <option value={'offline'}>offline</option>
                                    <option value={'online'}>online</option>
                                </Select>
                            </div>

                            <div className="w-full flex items-center gap-4">
                                <label htmlFor='location_domain' className="min-w-36 max-w-36 text-sm font-medium text-gray-700">
                                    Location:
                                </label>
                                <Select id="location_domain" name="location_domain" className="w-full" defaultValue="com" required>
                                    {listDomains.map((domain) => (
                                        <option key={domain} value={domain}>
                                            {domain.toUpperCase()}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            <hr className='w-full' />

                            <div className='w-full flex justify-center items-center gap-4'>
                                <Button type="button" onClick={() => window.location.href = "/scope"} className="mt-4" color="light">
                                    Previous
                                </Button>
                                <Button type="submit" className="mt-4" disabled={isPending}>
                                    {isPending ? <Spinner aria-label="Loading..." /> : 'Authenticate'}
                                </Button>
                            </div>
                        </form>
                    ) : (code) ? (
                        <form action={formActionToken} className="w-full flex flex-col justify-center items-center gap-4">
                            <Step index={2} />
                            <div className="w-full flex items-center justify-between gap-4">
                                <span className='min-w-36 max-w-36'>{'Code'}: </span>
                                <TextInput
                                    readOnly
                                    id="code"
                                    name="code"
                                    type="text"
                                    className='w-full'
                                    value={code || ''}
                                    required
                                />
                            </div>
                            <div className="w-full flex items-center justify-between gap-4">
                                <span className='min-w-36 max-w-36'>{'Client id'}: </span>
                                <TextInput id="client_id" name="client_id" className='w-full' type="text" readOnly value={clientId || ''} required />
                            </div>
                            <div className="w-full flex items-center justify-between gap-4">
                                <span className='min-w-36 max-w-36'>{'Client secret'}: </span>
                                <TextInput id="client_secret" name="client_secret" className='w-full' type="text" readOnly value={clientSecret || ''} required />
                            </div>
                            <div className="w-full flex items-center justify-between gap-4">
                                <span className='min-w-36 max-w-36'>{'Location'}: </span>
                                <TextInput id="location_domain" name="location_domain" className='w-full' type="text" readOnly value={locationDomain || ''} required />
                            </div>
                            <div className="w-full flex items-center justify-between gap-4">
                                <span className='min-w-36 max-w-36'>{'Redirect uri'}: </span>
                                <TextInput id="redirect_uri" name="redirect_uri" className='w-full' type="text" readOnly value={REDIRECT_URI} required />
                            </div>
                            <div className="w-full flex items-center justify-between gap-4">
                                <span className='min-w-36 max-w-36'>{'Grant type'}: </span>
                                <TextInput id="grant_type" name="grant_type" className='w-full' type="text" readOnly value={'authorization_code'} required />
                            </div>

                            <hr className='w-full' />

                            {!response && (
                                <div className='w-full flex justify-center items-center gap-4'>
                                    <Button type="button" color="failure" onClick={() => window.location.href = '/'}>
                                        Re-authenticate
                                    </Button>
                                    <Button type="submit">
                                        Generate Token
                                    </Button>
                                </div>
                            )}

                            {response && (<div className="w-full flex flex-col gap-4 justify-center items-center">

                                <div className="w-full flex flex-col gap-4 justify-center items-center">
                                    <div className='w-full flex flex-col gap-4'>
                                        <label htmlFor="response">Response:</label>
                                        <Textarea
                                            id="response"
                                            name="response"
                                            value={JSON.stringify(response, null, 2)}
                                            readOnly
                                            rows={15}
                                        />
                                    </div>
                                    <div className="relative w-full flex justify-center items-center gap-4">
                                            <ClipboardWithIconText valueToCopy={JSON.stringify(response)} />
                                        <Button type="button" color="failure" onClick={() => window.location.href = '/'}>
                                            Re-authenticate
                                        </Button>
                                        <Button type="button" onClick={() => window.location.href = "/request"}>
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </div>)}
                        </form>
                    ) : <></>}
                </div>
            </div>
        </div>
    );
};

export default OAuth;