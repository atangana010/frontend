import React from 'react';
import { usePaiement } from '../contexts/PaiementContext';
import SuiviPaiement from '../components/paiement/SuiviPaiement';

const SuiviPage = () => {
    const { inscription, setEtape, setInscription, setEtudiant, setError } = usePaiement();
    
    const handlePaiementComplete = (data) => {
        // Mettre à jour l'inscription avec les données complètes
        setInscription({
            ...inscription,
            ...data.inscription,
            date_paiement: data.inscription.date_paiement
        });
        setEtape('confirmation');
    };
    
    if (!inscription || !inscription.id) {
        // Rediriger vers la vérification si pas d'inscription
        setEtape('verification');
        return null;
    }
    
    return (
        <SuiviPaiement
            inscriptionId={inscription.id}
            onComplete={handlePaiementComplete}
        />
    );
};

export default SuiviPage;