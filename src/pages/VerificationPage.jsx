import React, { useState } from 'react';
import { usePaiement } from '../../contexts/PaiementContext';
import { rechercherEtudiant } from '../../services/etudiantService';
import Notification from '../commun/Notification';

export default function VerificationMatricule() {
  const [matricule, setMatricule] = useState('');
  const [erreurLocale, setErreurLocale] = useState(null);
  const { chargement, debutChargement, finChargement, definirEtudiant } = usePaiement();

  const handleSoumettre = async (e) => {
    e.preventDefault();
    setErreurLocale(null);

    const matriculeNet = matricule.trim().toUpperCase();
    if (!matriculeNet || matriculeNet.length < 3) {
      setErreurLocale('Veuillez saisir un matricule valide (minimum 3 caractères)');
      return;
    }

    debutChargement();
    try {
      const etudiant = await rechercherEtudiant(matriculeNet);
      if (!etudiant) {
        setErreurLocale(`Aucun étudiant trouvé avec le matricule "${matriculeNet}".`);
        finChargement();
        return;
      }
      definirEtudiant(etudiant, null);
    } catch (err) {
      setErreurLocale(err.message || 'Erreur lors de la vérification du matricule');
      finChargement();
    }
  };

  return (
    <div className="animate-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primaire-500/10 border border-primaire-500/20 mb-4">
          <svg className="w-8 h-8 text-primaire-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Vérification du matricule</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          Entrez votre matricule pour afficher vos informations et procéder au paiement.
        </p>
      </div>

      <div className="carte p-8 max-w-md mx-auto">
        <form onSubmit={handleSoumettre} className="space-y-5">
          <div>
            <label className="etiquette" htmlFor="matricule">Numéro de matricule</label>
            <input
              id="matricule"
              type="text"
              className="champ-saisie uppercase tracking-widest text-lg"
              placeholder="Ex: UY1-23-4567"
              value={matricule}
              onChange={(e) => { setMatricule(e.target.value); setErreurLocale(null); }}
              disabled={chargement}
              maxLength={50}
              autoFocus
            />
          </div>

          {erreurLocale && (
            <Notification type="erreur" message={erreurLocale} onFermer={() => setErreurLocale(null)} />
          )}

          <button type="submit" className="btn-primaire w-full text-base py-4"
            disabled={chargement || !matricule.trim()}>
            {chargement ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Recherche en cours…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Rechercher mon profil
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between text-sm">
          <span className="text-slate-500">Montant des frais d'inscription</span>
          <span className="font-bold text-accent-400 text-base font-mono">100 000 FCFA</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-slate-600 mb-3">Opérateurs Mobile Money acceptés</p>
        <div className="flex items-center justify-center gap-3">
          {[
            { nom: 'MTN',    couleur: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' },
            { nom: 'Orange', couleur: 'bg-orange-500/10 border-orange-500/20 text-orange-400' },
          ].map((op) => (
            <span key={op.nom} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${op.couleur}`}>
              {op.nom}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}