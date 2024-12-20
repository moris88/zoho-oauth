import { useEffect, useState } from 'react';
import { Button, Checkbox, TextInput } from 'flowbite-react';
import zohoScopes from '@/assets/zoho_scopes.json';

interface ScopeSelectorProps {
    onEmptyScopes: (isEmpty: boolean) => void;
}

const ScopeSelector = ({ onEmptyScopes }: ScopeSelectorProps) => {
    const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
    const [otherScope, setOtherScope] = useState<string | null>(null);
    const [searchScope, setSearchScope] = useState<string | null>(null);

    useEffect(() => {
        const storedScopes = localStorage.getItem('scopes');
        if (storedScopes) {
            setSelectedScopes(JSON.parse(storedScopes || '[]'));
        }
    }, []);

    // Funzione per aggiornare gli scope selezionati
    const handleScopeChange = (scope: string) => {
        setSelectedScopes((prev) => {
            if (prev.includes(scope)) {
                const newScopes = prev.filter((s) => s !== scope);
                localStorage.setItem('scopes', JSON.stringify(newScopes));
                onEmptyScopes(newScopes.length === 0);
                return newScopes;
            } else {
                const newScopes = [...prev, scope];
                localStorage.setItem('scopes', JSON.stringify(newScopes));
                onEmptyScopes(newScopes.length === 0);
                return newScopes;
            }
        });
    };

    const handleNewScope = () => {
        if (!otherScope) {
            return;
        }
        const otherScopes: string[] = [];
        if (otherScope.includes(',')) {
            const scopes = otherScope.split(',');
            if (scopes.some(scope => selectedScopes.includes(scope))) {
                alert('One or more scopes have already been selected!');
                setOtherScope(null);
                return;
            }
            otherScopes.push(...scopes);
        } else {
            if (selectedScopes.includes(otherScope)) {
                alert('This scope has already been selected!');
                setOtherScope(null);
                return;
            }
            otherScopes.push(otherScope);
        }
        otherScopes.forEach((scope) => {
            handleScopeChange(scope);
        });
        setOtherScope(null);
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <TextInput
                id="url"
                type="text"
                value={searchScope || ''}
                onChange={(e) => setSearchScope(e.target.value)}
                placeholder="Search scope"
                required
            />
            {/* Elenco scopes */}
            <div className="max-h-72 overflow-y-auto p-1">
                {Object.entries(zohoScopes)
                    .filter(([, data]: any) => {
                        if (!searchScope) {
                            return true;
                        }
                        return data.scopes.some((scope: string) => scope.toLowerCase().includes(searchScope.toLowerCase()));
                    })
                    .map(([service, data]: any) => {
                        return (
                            <div key={service} className="mb-6">
                                <h3 className="text-xl font-semibold mb-2">{data.description}</h3>
                                <div className="flex flex-col gap-2">
                                    {data.scopes.filter(
                                        (scope: string) => {
                                            if (!searchScope) return true
                                            return scope.toLowerCase().includes(searchScope.toLowerCase())
                                        }

                                    ).map((scope: string) => {
                                        return (
                                            <div key={scope} className="flex items-center">
                                                <Checkbox
                                                    id={scope}
                                                    checked={selectedScopes.includes(scope)}
                                                    onChange={() => handleScopeChange(scope)}
                                                />
                                                <label htmlFor={scope} className="ml-2 text-sm font-medium text-gray-900 select-none">
                                                    {scope}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
            </div>
            <div className="flex flex-col gap-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="client_secret">
                    Other Scopes (comma separated)
                </label>
                <TextInput
                    id="url"
                    type="text"
                    value={otherScope || ''}
                    onChange={(e) => setOtherScope(e.target.value)}
                    placeholder="Insert other scopes"
                    required
                />
                <div>
                    <Button disabled={otherScope === null} onClick={handleNewScope}>
                        Add Scopes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ScopeSelector;
