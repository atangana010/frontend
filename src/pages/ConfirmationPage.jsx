import React from 'react';
import { usePaiement } from '../contexts/PaiementContext';
import RecuPaiement from '../components/paiement/RecuPaiement';
import { HomeIcon } from '@heroicons/react/24/outline';

const ConfirmationPage = () => {
    const { etudiant, inscription, resetPaiement } = usePaiement();
    
    const handleDownload = () => {
        // Télécharger le PDF du reçu
        console.log('Téléchargement du reçu...');
    };
    
    const handlePrint = () => {
        window.print();
    };
    
    const handleNewInscription = () => {
        resetPaiement();
    };
    
    return (
        <div className="space-y-6">
            <RecuPaiement
                inscription={inscription}
                etudiant={etudiant}
                onDownload={handleDownload}
                onPrint={handlePrint}
            />
            
            <div className="flex justify-center">
                <button
                    onClick={handleNewInscription}
                    className="btn-secondary flex items-center space-x-2"
                >
                    <HomeIcon className="h-5 w-5" />
                    <span>Nouvelle inscription</span>
                </button>
            </div>
        </div>
    );
};

export default ConfirmationPage;