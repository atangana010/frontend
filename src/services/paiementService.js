// services/paiementService.js — Appels vers le backend paiement
import api from './api';

/**
 * Récupérer les opérateurs Mobile Money disponibles
 * Appelé au chargement de PaiementForm pour afficher les logos/préfixes
 */
export async function getOperateurs() {
  const { data } = await api.get('/paiements/operateurs');
  return data.donnees;
}

/**
 * Initier un paiement Mobile Money via le backend
 * Le backend vérifie l'étudiant, crée la transaction et appelle Campay
 */
export async function initierPaiement({ matricule, telephone, nomEtudiant, filiere }) {
  const { data } = await api.post('/paiements/initier', {
    matricule,
    telephone,
    nomEtudiant,
    filiere,
  });
  return data.donnees;
  // Retourne : { transactionId, referenceExterne, referenceCampay,
  //              codeUSSD, operateur, montant, devise, statut, message }
}

/**
 * Vérifier le statut d'un paiement (polling toutes les 5s)
 * Le backend interroge Campay et met à jour Supabase
 */
export async function verifierStatutPaiement(transactionId) {
  const { data } = await api.get(`/paiements/statut/${transactionId}`);
  return data.donnees;
  // Retourne : { statut, statutCampay, datePaiement, ... }
}

/**
 * Récupérer les détails complets d'une transaction (pour le reçu)
 */
export async function getTransaction(transactionId) {
  const { data } = await api.get(`/paiements/${transactionId}`);
  return data.donnees;
}