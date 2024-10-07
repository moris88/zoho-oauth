import { useState } from 'react';
import { Button } from 'flowbite-react';

const CopyText = ({ textToCopy }: { textToCopy: string }) => {
    const [copySuccess, setCopySuccess] = useState('');

    // Funzione per copiare il testo negli appunti
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setCopySuccess('Copiato!');
            })
            .catch((err) => {
                console.error('Errore nel copiare!', err);
                setCopySuccess('Errore nel copiare!');
            });
        setTimeout(() => {
            setCopySuccess('');
        }, 2000);
    };

    return (
        <div className="flex justify-center items-center gap-6">
            {/* Messaggio di conferma */}
            {copySuccess && <p className="mt-2 text-green-500">{copySuccess}</p>}
            
            {/* Pulsante per copiare */}
            <Button onClick={handleCopy}>Copia</Button>
        </div>
    );
};

export default CopyText;