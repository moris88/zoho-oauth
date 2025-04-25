import { useEffect, useState } from 'react';
import { Checkbox, TextInput } from 'flowbite-react';
import { MdSearch } from "react-icons/md";
import zohoScopes from '@/assets/zoho_scopes.json';

interface ScopeSelectorProps {
    onEmptyScopes: (isEmpty: boolean) => void;
    onChangeScopes: (scopes: string[]) => void;
}

const ScopeSelector = ({ onEmptyScopes, onChangeScopes }: ScopeSelectorProps) => {
    const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
    const [searchScope, setSearchScope] = useState<string | null>(null);

    useEffect(() => {
        const storedScopes = localStorage.getItem('scopes');
        if (storedScopes) {
            setSelectedScopes(storedScopes.split(','));
            onChangeScopes(storedScopes.split(','));
            onEmptyScopes(storedScopes.split(',').length === 0);
        }
    }, [onChangeScopes, onEmptyScopes]);

    // Funzione per aggiornare gli scope selezionati
    const handleScopeChange = (scope: string) => {
        setSelectedScopes((prev) => {
            if (prev.includes(scope)) {
                const newScopes = prev.filter((s) => s !== scope);
                onChangeScopes(newScopes);
                onEmptyScopes(newScopes.length === 0);
                return newScopes;
            } else {
                const newScopes = [...prev, scope];
                onChangeScopes(newScopes);
                onEmptyScopes(newScopes.length === 0);
                return newScopes;
            }
        });
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <TextInput
                type="text"
                icon={MdSearch}
                value={searchScope || ''}
                onChange={(e) => setSearchScope(e.target.value)}
                placeholder="Search scope"
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
        </div>
    );
};

export default ScopeSelector;
