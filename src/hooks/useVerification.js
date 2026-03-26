// hooks/useVerification.js
// Encapsule la logique de recherche matricule
// utilisé par VerificationMatricule.jsx
import { useCallback } from 'react';
import { usePaiement } from '../contexts/PaiementContext';
import { rechercherEtudiant } from '../services/etudiantService';

export function useVerification() {
  const {
    chargement,
    erreur,
    etudiant,
    debutChargement,
    finChargement,
    definirErreur,
    definirEtudiant,
    effacerErreur,
    reinitialiser,
    changerEtape,
  } = usePaiement();

  const rechercherParMatricule = useCallback(async (matricule) => {
    effacerErreur();
    debutChargement();

    try {
      const trouve = await rechercherEtudiant(matricule);

      if (!trouve) {
        definirErreur(`Aucun étudiant trouvé avec le matricule "${matricule.toUpperCase()}".`);
        return false;
      }

      // false = rester sur la page vérification pour afficher les infos
      definirEtudiant(trouve, null, false);
      return true;

    } catch (err) {
      definirErreur(err.message || 'Erreur lors de la vérification du matricule');
      return false;
    } finally {
      finChargement();
    }
  }, [debutChargement, finChargement, definirErreur, definirEtudiant, effacerErreur]);

  const passerAuPaiement = useCallback(() => {
    changerEtape('paiement');
  }, [changerEtape]);

  const reinitialiserRecherche = useCallback(() => {
    reinitialiser();
  }, [reinitialiser]);

  return {
    chargement,
    erreur,
    etudiant,
    rechercherParMatricule,
    passerAuPaiement,
    reinitialiserRecherche,
  };
}