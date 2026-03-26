// components/etudiant/VerificationMatricule.jsx
import React, { useState } from 'react';
import { useVerification } from '../../hooks/useVerification';
import Notification from '../commun/Notification';

function formatDate(v) {
  if (!v) return '—';
  const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return v;
  const d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]));
  return isNaN(d.getTime()) ? v : d.toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

function Ligne({ label, valeur }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2.5 border-b border-gray-100 last:border-0">
      <dt className="text-xs font-medium text-gray-500 sm:w-44 flex-shrink-0">{label}</dt>
      <dd className="text-sm text-gray-800 font-medium">{valeur || '—'}</dd>
    </div>
  );
}

export default function VerificationMatricule() {
  const [matricule, setMatricule]     = useState('');
  const [erreurLocale, setErreurLocale] = useState(null);

  const { chargement, erreur, etudiant, rechercherParMatricule, passerAuPaiement, reinitialiserRecherche } = useVerification();

  const handleRechercher = async (e) => {
    e.preventDefault();
    setErreurLocale(null);
    const mat = matricule.trim().toUpperCase();
    if (mat.length < 3) { setErreurLocale('Matricule trop court (minimum 3 caractères)'); return; }
    await rechercherParMatricule(mat);
  };

  const handleReinitialiser = () => {
    setMatricule('');
    setErreurLocale(null);
    reinitialiserRecherche();
  };

  const initiales = etudiant?.nom_complet
    ?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '??';

  return (
    <div className="animate-in max-w-xl mx-auto">

      {/* ══ FORMULAIRE ══ */}
      {!etudiant && (
        <>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac' }}>
              <svg className="w-8 h-8" style={{ color: '#227838' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Vérification du matricule</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Entrez votre matricule pour afficher vos informations et procéder au paiement.
            </p>
          </div>

          <div className="carte p-8">
            <form onSubmit={handleRechercher} className="space-y-5">
              <div>
                <label className="etiquette" htmlFor="matricule">Numéro de matricule</label>
                <input id="matricule" type="text"
                  className="champ-saisie uppercase tracking-widest text-lg"
                  placeholder="Ex: 25m38888"
                  value={matricule}
                  onChange={(e) => { setMatricule(e.target.value); setErreurLocale(null); }}
                  disabled={chargement} maxLength={50} autoFocus />
              </div>

              {erreurLocale && <Notification type="erreur" message={erreurLocale} onFermer={() => setErreurLocale(null)} />}
              {erreur && !erreurLocale && <Notification type="erreur" message={erreur} />}

              <button type="submit" className="btn-primaire w-full text-base py-4"
                disabled={chargement || !matricule.trim()}>
                {chargement ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Recherche en cours…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    Vérifier le matricule
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 mb-3">Opérateurs acceptés</p>
            <div className="flex items-center justify-center gap-3">
              {[
                { nom: 'MTN',    style: { background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' } },
                { nom: 'Orange', style: { background: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa' } },
              ].map(op => (
                <span key={op.nom} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={op.style}>
                  {op.nom}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ══ RÉSULTAT ══ */}
      {etudiant && (
        <div className="animate-in space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl"
            style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac' }}>
            <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#166534' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
            <p className="text-sm font-medium" style={{ color: '#166534' }}>
              Profil trouvé — vérifiez vos informations puis cliquez sur <strong>Suivant</strong>.
            </p>
          </div>

          <div className="carte p-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                style={{ backgroundColor: '#227838' }}>
                {initiales}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-lg">{etudiant.nom_complet}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  <span className="font-mono font-semibold" style={{ color: '#227838' }}>{etudiant.matricule}</span>
                  {etudiant.filiere ? ` · ${etudiant.filiere}` : ''}
                </p>
              </div>
            </div>
            <dl>
              <Ligne label="Matricule"          valeur={etudiant.matricule} />
              <Ligne label="Date de naissance"  valeur={formatDate(etudiant.date_naissance)} />
              <Ligne label="Lieu de naissance"  valeur={etudiant.lieu_naissance} />
              <Ligne label="Genre"              valeur={etudiant.genre === 'M' ? 'Masculin' : etudiant.genre === 'F' ? 'Féminin' : etudiant.genre} />
              <Ligne label="Nationalité"        valeur={etudiant.nationalite} />
              <Ligne label="Filière"            valeur={etudiant.filiere} />
              <Ligne label="Baccalauréat"       valeur={etudiant.bacc} />
              {etudiant.email     && <Ligne label="Email"     valeur={etudiant.email} />}
              {etudiant.telephone && <Ligne label="Téléphone" valeur={etudiant.telephone} />}
            </dl>
          </div>

          <div className="carte p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Frais universitaires 2025–2026</p>
              <p className="text-xs text-gray-400">Montant fixe — non modifiable</p>
            </div>
            <span className="text-2xl font-bold font-mono" style={{ color: '#227838' }}>
              100 000 <span className="text-sm">FCFA</span>
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleReinitialiser} className="btn-secondaire px-5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Modifier
            </button>
            <button onClick={passerAuPaiement} className="btn-primaire flex-1 text-base py-4">
              Suivant — Procéder au paiement
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}