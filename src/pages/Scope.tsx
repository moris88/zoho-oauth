import { useState, useActionState } from 'react'
import { Button, Spinner, Textarea } from 'flowbite-react'
import { ScopeSelector, Step } from '@/components'
import { actionScope } from '@/utils'

const Scope = () => {
    const [emptyScopes, setEmptyScopes] = useState(true);
    const [{ scopes }, formAction, isPending] = useActionState(actionScope, {
        scopes: localStorage.getItem('scopes') || '',
    })

    const [enterScopes, setEnterScopes] = useState<string>(
        scopes || localStorage.getItem('scopes') || ''
    );
    const clientId = localStorage.getItem('client_id');
    const clientSecret = localStorage.getItem('client_secret');

    if (!clientId || !clientSecret) {
        window.location.href = '/';
    }

    if (isPending) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner
                    aria-label="Fetching data..."
                />
            </div>
        )
    }

    return (
        <div className="p-5 bg-gray-100 min-h-screen">
            <form action={formAction} className="w-full flex flex-col gap-4 justify-center items-center p-4 rounded-lg shadow-md bg-white">
                <Step index={0} />
                <h1 className="text-3xl font-bold mb-4">Select Scopes</h1>

                <hr className="w-full" />

                <div className="lg:w-1/2 w-full">
                    <div className="w-full flex flex-col lg:flex-row gap-4 lg:items-start justify-center items-center p-6">
                        <div className='flex flex-col gap-4 w-full'>
                            <ScopeSelector onEmptyScopes={setEmptyScopes} onChangeScopes={(scopes) => setEnterScopes(scopes.join(','))} />
                        </div>
                    </div>
                </div>

                <hr className="w-full" />

                <div className="lg:w-1/2 w-full">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="scopes">List Scopes</label>
                    <Textarea
                        id="scopes"
                        name="scopes"
                        required
                        rows={4}
                        defaultValue={enterScopes}
                    />
                </div>

                <hr className="w-full" />

                <div className="w-full flex justify-center items-center gap-4">
                    <Button type="button" onClick={() => window.location.href = "/"} color="gray">
                        Previous
                    </Button>
                    <Button type="submit" disabled={emptyScopes || isPending}>
                        Next
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Scope;
