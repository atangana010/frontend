import React, { createContext, useContext, useReducer, useCallback } from 'react';

const PaiementContext = createContext(null);

const etatInitial = {
  etudiant: null,
  transaction: null,
  etape: 'verification',
  chargement: false,
  erreur: null,
};

function paiementReducer(etat, action) {
  switch (action.type) {
    case 'DEBUT_CHARGEMENT':
      return { ...etat, chargement: true, erreur: null };
    case 'FIN_CHARGEMENT':
      return { ...etat, chargement: false };
    case 'DEFINIR_ERREUR':
      return { ...etat, erreur: action.payload, chargement: false };
    case 'EFFACER_ERREUR':
      return { ...etat, erreur: null };
    case 'DEFINIR_ETUDIANT':
      return {
        ...etat,
        etudiant: action.payload.etudiant,
        etape: action.payload.allerPaiement ? 'paiement' : etat.etape,
        chargement: false,
        erreur: null,
      };
    case 'PAIEMENT_INITIE':
      return { ...etat, transaction: action.payload, etape: 'suivi', chargement: false, erreur: null };
    case 'PAIEMENT_COMPLETE':
      return { ...etat, transaction: action.payload, etape: 'confirmation', chargement: false };
    case 'STATUT_MIS_A_JOUR':
      if (!etat.transaction) return etat;
      return { ...etat, transaction: { ...etat.transaction, ...action.payload } };
    case 'REINITIALISER':
      return etatInitial;
    case 'CHANGER_ETAPE':
      return { ...etat, etape: action.payload };
    default:
      return etat;
  }
}

export function PaiementProvider({ children }) {
  const [etat, dispatch] = useReducer(paiementReducer, etatInitial);

  const debutChargement  = useCallback(() => dispatch({ type: 'DEBUT_CHARGEMENT' }), []);
  const finChargement    = useCallback(() => dispatch({ type: 'FIN_CHARGEMENT' }), []);
  const effacerErreur    = useCallback(() => dispatch({ type: 'EFFACER_ERREUR' }), []);
  const reinitialiser    = useCallback(() => dispatch({ type: 'REINITIALISER' }), []);
  const definirErreur    = useCallback((msg) => dispatch({ type: 'DEFINIR_ERREUR', payload: msg }), []);
  const changerEtape     = useCallback((etape) => dispatch({ type: 'CHANGER_ETAPE', payload: etape }), []);
  const definirTransaction = useCallback((t) => dispatch({ type: 'PAIEMENT_INITIE', payload: t }), []);

  // allerPaiement=false => on reste sur la page vérification (on affiche juste les infos)
  // allerPaiement=true  => on passe à l'étape paiement
  const definirEtudiant = useCallback(
    (etudiant, _ignored = null, allerPaiement = false) => {
      dispatch({ type: 'DEFINIR_ETUDIANT', payload: { etudiant, allerPaiement } });
    }, []
  );

  const mettreAJourStatut = useCallback((donnees) => {
    if (donnees.statut === 'complete') {
      dispatch({ type: 'PAIEMENT_COMPLETE', payload: { ...etat.transaction, ...donnees } });
    } else {
      dispatch({ type: 'STATUT_MIS_A_JOUR', payload: donnees });
    }
  }, [etat.transaction]);

  return (
    <PaiementContext.Provider value={{
      ...etat,
      debutChargement, finChargement, definirErreur, effacerErreur,
      reinitialiser, changerEtape, definirEtudiant, definirTransaction, mettreAJourStatut,
    }}>
      {children}
    </PaiementContext.Provider>
  );
}

export function usePaiement() {
  const ctx = useContext(PaiementContext);
  if (!ctx) throw new Error('usePaiement doit être dans <PaiementProvider>');
  return ctx;
}