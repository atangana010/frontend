// Composant d'affichage des informations de l'étudiant
import React from 'react';
import { usePaiement } from '../../contexts/PaiementContext';

function LigneInfo({ label, valeur }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2.5 border-b border-slate-800/60 last:border-0">
      <dt className="text-xs font-medium text-slate-500 sm:w-40 flex-shrink-0">{label}</dt>
      <dd className="text-sm text-slate-200 font-medium">{valeur || '—'}</dd>
    </div>
  );
}

export default function InfoEtudiant() {
  const { etudiant, reinitialiser } = usePaiement();

  if (!etudiant) return null;

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  const initiales = etudiant.nom_complet
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '??';

  return (
    <div className="animate-in mb-6">
      <div className="carte p-6">
        {/* En-tête avec avatar et nom */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primaire-500 to-primaire-700 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg shadow-primaire-900/50">
            {initiales}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-100 text-lg leading-tight truncate">
              {etudiant.nom_complet}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              <span className="font-mono text-primaire-400">{etudiant.matricule}</span>
              {' · '}{etudiant.filiere}
            </p>
          </div>
          <button
            onClick={reinitialiser}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-300"
            title="Changer de matricule"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Informations détaillées */}
        <dl className="space-y-0">
          <LigneInfo label="Matricule" valeur={etudiant.matricule} />
          <LigneInfo label="Date de naissance" valeur={etudiant.date_naissance} />
          <LigneInfo label="Lieu de naissance" valeur={etudiant.lieu_naissance} />
          <LigneInfo label="Genre" valeur={etudiant.genre === 'M' ? 'Masculin' : 'Féminin'} />
          <LigneInfo label="Nationalité" valeur={etudiant.nationalite} />
          <LigneInfo label="Filière" valeur={etudiant.filiere} />
          <LigneInfo label="Baccalauréat" valeur={etudiant.bac} />
          {etudiant.email && <LigneInfo label="Email" valeur={etudiant.email} />}
          {etudiant.telephone && <LigneInfo label="Téléphone" valeur={etudiant.telephone} />}
          {etudiant.handicap && (
            <div className="pt-2">
              <span className="badge-statut bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs">
                ♿ Étudiant en situation de handicap
              </span>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}