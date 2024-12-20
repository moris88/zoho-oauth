import { Button } from "flowbite-react";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";

const CopyText = ({ icon = false, textToCopy }: { icon?: boolean, textToCopy: string }) => {
    const [copySuccess, setCopySuccess] = useState('');

    // Funzione per copiare il testo negli appunti
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setCopySuccess('Copied!');
            })
            .catch((err) => {
                console.error(err);
                setCopySuccess('Error copying');
            });
        setTimeout(() => {
            setCopySuccess('');
        }, 2000);
        navigator.clipboard.writeText(textToCopy);
    };

    if (icon) {
        return <FaCopy className="inline w-6 h-6 hover:text-[#155e75] cursor-pointer" onClick={handleCopy} />
    }
    
    return (
        <div className="flex justify-center items-center gap-6">
            {/* Messaggio di conferma */}
            {copySuccess && <p className="mt-2 text-green-500">{copySuccess}</p>}

            {/* Pulsante per copiare */}
            <Button onClick={handleCopy}>Copy</Button>
        </div>
    );
};

export default CopyText;