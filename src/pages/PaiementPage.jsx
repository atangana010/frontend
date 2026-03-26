import React from 'react';
import { usePaiement } from '../contexts/PaiementContext';
import PaiementForm from '../components/paiement/PaiementForm';
import paiementService from '../services/paiementService';

const PaiementPage = () => {
    const { etudiant, frais, setEtape, setInscription, setLoading, setError } = usePaiement();
    
    const handlePaiementInitie = async (matricule, telephone, email) => {
        setLoading(true);
        
        try {
            const resultat = await paiementService.initierPaiement(matricule, telephone, email);
            
            if (resultat.success) {
                setInscription({
                    id: resultat.inscription_id,
                    reference: resultat.reference_campay,
                    reference_externe: resultat.reference_externe
                });
                setEtape('suivi');
            }
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <PaiementForm
            etudiant={etudiant}
            frais={frais}
            onPaiementInitie={handlePaiementInitie}
        />
    );
};

export default PaiementPage;