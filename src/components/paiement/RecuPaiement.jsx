// components/paiement/RecuPaiement.jsx
import React, { useRef } from 'react';
import { usePaiement } from '../../contexts/PaiementContext';

function libellePaiement(operateur) {
  if (!operateur) return 'Mobile Money';
  const op = operateur.toUpperCase();
  if (op === 'MTN')    return 'MTN Mobile Money';
  if (op === 'ORANGE') return 'Orange Money';
  if (op === 'CAMTEL') return 'Camtel Mobile Money';
  return `${operateur} Mobile Money`;
}

export default function RecuPaiement() {
  const { etudiant, transaction, reinitialiser } = usePaiement();
  const recuRef = useRef(null);

  if (!transaction || !etudiant) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const datePaiement = transaction.datePaiement || transaction.date_paiement || transaction.createdAt;
  const referenceAff = transaction.referenceExterne || transaction.reference_externe || '—';
  const telephone    = transaction.telephone || '—';
  const montant      = Number(transaction.montant || 100000).toLocaleString('fr-FR');
  const methodePaie  = libellePaiement(transaction.operateur);

  return (
    <div className="animate-in max-w-2xl mx-auto">

      {/* Bandeau succès */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 border-2"
          style={{ backgroundColor: '#dcfce7', borderColor: '#227838' }}>
          <svg className="w-10 h-10" style={{ color: '#166534' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Paiement confirmé !</h2>
        <p className="text-gray-500 text-sm">Votre inscription a été enregistrée avec succès.</p>
      </div>

      {/* Reçu */}
      <div ref={recuRef} className="carte p-8 print:shadow-none">

        {/* En-tête */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src="https://www.esign.cm/images/uiecc_logo_old1.png"
              alt="Logo UIECC" className="h-12 w-auto object-contain"
              onError={(e) => { e.target.style.display='none'; }} />
            <div>
              <h3 className="font-bold text-gray-800">UIECC</h3>
              <p className="text-xs text-gray-500">Direction de la Scolarité</p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium mb-1"
              style={{ backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              Paiement validé
            </div>
            <p className="text-xs text-gray-400 font-mono">{formatDate(datePaiement)}</p>
          </div>
        </div>

        <div className="text-center mb-6">
          <h4 className="text-lg font-bold text-gray-700 uppercase tracking-wide">
            Reçu de paiement — Frais d'inscription 2024–2025
          </h4>
        </div>

        {/* Infos étudiant */}
        <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: '#f8faf8', border: '1px solid #e5e7eb' }}>
          <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Informations étudiant
          </h5>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Nom complet', etudiant.nom_complet],
              ['Matricule',   etudiant.matricule],
              ['Filière',     etudiant.filiere],
              ['Nationalité', etudiant.nationalite],
            ].map(([label, valeur]) => (
              <div key={label}>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{valeur || '—'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Détails paiement */}
        <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: '#f8faf8', border: '1px solid #e5e7eb' }}>
          <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Détails du paiement
          </h5>
          <div className="space-y-2">
            {[
              ['Référence',           referenceAff],
              ['Numéro Mobile Money', `+237 ${telephone}`],
              ['Méthode',             methodePaie],
              ['Date',                formatDate(datePaiement)],
            ].map(([label, valeur]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-400">{label}</span>
                <span className="text-gray-700 font-medium text-xs">{valeur}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Montant */}
        <div className="rounded-xl p-5 flex items-center justify-between border-2"
          style={{ borderColor: '#227838', backgroundColor: '#f0faf2' }}>
          <div>
            <p className="text-sm text-gray-500">Montant payé</p>
            <p className="text-xs text-gray-400">Frais d'inscription — 2025–2026</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold font-mono" style={{ color: '#227838' }}>{montant}</p>
            <p className="text-sm font-semibold text-gray-500">FCFA</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Ce reçu est généré automatiquement et fait foi de paiement. Conservez-le pour toute réclamation.
          </p>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 no-print">
        <button onClick={() => window.print()} className="btn-primaire flex-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          Imprimer le reçu
        </button>
        <button onClick={reinitialiser} className="btn-secondaire flex-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}