import { useState } from 'react'
import { Button } from 'flowbite-react'
import { ScopeSelector } from '@/components'

const Scope = () => {
    const [emptyScopes, setEmptyScopes] = useState(true);

    const clientId = localStorage.getItem('client_id');
    const clientSecret = localStorage.getItem('client_secret');

    if (!clientId || !clientSecret) {
        window.location.href = '/';
    }

    const handleSave = () => {
        if (emptyScopes) {
            return;
        }
        window.location.href = '/oauth';
    };

    const handlePrev = () => {
        handleCancel();
        window.location.href = '/';
    };

    const handleCancel = () => {
        localStorage.removeItem('scopes');
        setEmptyScopes(true);
    };

    return (
        <div className="p-5 bg-gray-100 min-h-screen">
            <div className="flex flex-col gap-4 justify-center items-center p-4 rounded-lg shadow-md bg-white">
                <h1 className="text-3xl font-bold mb-4">Select Scopes</h1>
                <hr className="w-full" />
                <div className="w-full flex flex-col lg:flex-row gap-4 lg:items-start justify-center items-center max-w-max p-6">
                    <div className='flex flex-col gap-4 w-full'>
                        <ScopeSelector onEmptyScopes={setEmptyScopes} />
                    </div>
                </div>

                <hr className="w-full" />

                <div className="w-full flex justify-center items-center gap-4">
                    <Button onClick={handleSave} className="mt-4" disabled={emptyScopes}>
                        Next
                    </Button>
                    <Button onClick={handlePrev} className="mt-4">
                        Previous
                    </Button>
                    <Button color="failure" onClick={handleCancel} className="mt-4">
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Scope;
