// components/paiement/SuiviPaiement.jsx
import React, { useEffect, useRef, useCallback } from 'react';
import { usePaiement } from '../../contexts/PaiementContext';
import { verifierStatutPaiement } from '../../services/paiementService';
import Notification from '../commun/Notification';

const INTERVALLE    = 5000;
const MAX_TENTATIVES = 36;

export default function SuiviPaiement() {
  const { transaction, etudiant, mettreAJourStatut, reinitialiser } = usePaiement();
  const tentativesRef = useRef(0);
  const intervalRef   = useRef(null);

  const verifierStatut = useCallback(async () => {
    if (!transaction?.transactionId) return;
    if (tentativesRef.current >= MAX_TENTATIVES) { clearInterval(intervalRef.current); return; }
    tentativesRef.current += 1;
    try {
      const statut = await verifierStatutPaiement(transaction.transactionId);
      mettreAJourStatut(statut);
      if (['complete', 'echoue'].includes(statut.statut)) clearInterval(intervalRef.current);
    } catch {}
  }, [transaction?.transactionId, mettreAJourStatut]);

  useEffect(() => {
    if (transaction?.statut === 'en_attente') {
      const t = setTimeout(verifierStatut, 3000);
      intervalRef.current = setInterval(verifierStatut, INTERVALLE);
      return () => { clearTimeout(t); clearInterval(intervalRef.current); };
    }
  }, [verifierStatut, transaction?.statut]);

  if (!transaction) return null;

  const estEnAttente = transaction.statut === 'en_attente';
  const estEchoue   = transaction.statut === 'echoue';
  const progression = Math.min((tentativesRef.current / MAX_TENTATIVES) * 100, 95);
  const nomEtudiant = transaction.nomEtudiant || etudiant?.nom_complet || '—';
  const montant     = Number(transaction.montant || 100000).toLocaleString('fr-FR');
  const operateur   = transaction.operateur;
  const codeUSSD    = transaction.codeUSSD;

  const STYLES_OP = {
    MTN:    '#854d0e',
    Orange: '#9a3412',
    Camtel: '#1e40af',
  };

  return (
    <div className="animate-in max-w-lg mx-auto">
      <div className="carte p-8 text-center">

        {/* Indicateur */}
        <div className="relative inline-flex mb-6">
          {estEnAttente && (
            <>
              <div className="absolute inset-0 rounded-full animate-ping"
                style={{ backgroundColor: 'rgba(34,120,56,0.15)' }} />
              <div className="absolute inset-[-8px] rounded-full animate-pulse"
                style={{ backgroundColor: 'rgba(34,120,56,0.08)' }} />
            </>
          )}
          <div className="w-20 h-20 rounded-full flex items-center justify-center relative z-10 border-2"
            style={
              estEnAttente ? { backgroundColor: '#dcfce7', borderColor: '#227838' } :
              estEchoue   ? { backgroundColor: '#fee2e2', borderColor: '#ef4444' } :
                            { backgroundColor: '#dcfce7', borderColor: '#22c55e' }
            }>
            {estEnAttente ? (
              <svg className="w-10 h-10 animate-spin" style={{ color: '#227838' }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : estEchoue ? (
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-10 h-10" style={{ color: '#166534' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {estEnAttente ? 'En attente de validation' :
           estEchoue   ? 'Paiement échoué'          : 'Traitement…'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {estEnAttente ? 'Validez la demande sur votre téléphone Mobile Money.' :
           estEchoue   ? 'Le paiement n\'a pas pu être effectué.' :
                         'Votre paiement est en cours de traitement…'}
        </p>

        {/* Barre de progression */}
        {estEnAttente && (
          <div className="mb-6">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progression}%`, backgroundColor: '#227838' }} />
            </div>
            <p className="text-xs text-gray-400 mt-2">Vérification automatique</p>
          </div>
        )}

        {/* Détails */}
        <div className="rounded-xl p-4 text-left mb-6 space-y-2.5 border"
          style={{ backgroundColor: '#f8faf8', borderColor: '#e5e7eb' }}>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Étudiant</span>
            <span className="text-gray-800 font-medium">{nomEtudiant}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Téléphone</span>
            <span className="text-gray-700 font-mono">+237 {transaction.telephone}</span>
          </div>
          {operateur && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Opérateur</span>
              <span className="font-semibold" style={{ color: STYLES_OP[operateur] || '#227838' }}>{operateur}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Montant</span>
            <span className="font-bold font-mono" style={{ color: '#227838' }}>{montant} FCFA</span>
          </div>
          {codeUSSD && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Code USSD</span>
              <span className="font-mono font-bold" style={{ color: '#eab308' }}>{codeUSSD}</span>
            </div>
          )}
          <div className="flex justify-between text-sm pt-1 border-t border-gray-100">
            <span className="text-gray-500">Référence</span>
            <span className="font-mono text-xs text-gray-400 truncate max-w-[180px]">
              {transaction.referenceExterne || '—'}
            </span>
          </div>
        </div>

        {estEnAttente && (
          <Notification type="attente"
            message={codeUSSD
              ? `Composez ${codeUSSD} ou validez la notification sur votre téléphone.`
              : 'Une notification a été envoyée sur votre téléphone. Saisissez votre code PIN pour valider.'} />
        )}

        {estEchoue && (
          <div className="space-y-3">
            <Notification type="erreur" message="Paiement rejeté. Vérifiez votre solde et réessayez." />
            <button onClick={reinitialiser} className="btn-secondaire w-full">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Recommencer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}