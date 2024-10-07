import { useEffect, useState } from 'react';
import { Checkbox } from 'flowbite-react';
import zohoScopes from '@/assets/zoho_scopes.json';

interface ScopeSelectorProps {
    onEmptyScopes: (isEmpty: boolean) => void;
}

const ScopeSelector = ({ onEmptyScopes }: ScopeSelectorProps) => {
    const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

    useEffect(() => {
        const storedScopes = localStorage.getItem('scopes');
        if (storedScopes) {
            setSelectedScopes(JSON.parse(storedScopes || '[]'));
        }
    }, []);

    // Funzione per aggiornare gli scope selezionati
    const handleScopeChange = (scope: string) => {
        let myScopes = [...selectedScopes];
        if (myScopes.includes(scope)) {
            myScopes = myScopes.filter((s) => s !== scope);
        } else {
            myScopes.push(scope);
        }
        localStorage.setItem('scopes', JSON.stringify(myScopes));
        onEmptyScopes(myScopes.length === 0);
        setSelectedScopes(myScopes);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Seleziona gli Scopes</h2>

            {/* Elenco scopes */}
            <div className="p-1 max-h-72 overflow-y-auto">
                {Object.entries(zohoScopes).map(([service, data]: any) => {
                    return (
                        <div key={service} className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">{data.description}</h3>
                            <div className="flex flex-col gap-2">
                                {data.scopes.map((scope: string) => {
                                    return (
                                        <div key={scope} className="flex items-center">
                                            <Checkbox
                                                id={scope}
                                                checked={selectedScopes.includes(scope)}
                                                onChange={() => handleScopeChange(scope)}
                                            />
                                            <label htmlFor={scope} className="ml-2 text-sm font-medium text-gray-900">
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
