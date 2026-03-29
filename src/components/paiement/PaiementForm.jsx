// components/paiement/PaiementForm.jsx
import React, { useState, useEffect } from 'react';
import { usePaiement } from '../../contexts/PaiementContext';
import { initierPaiement, getOperateurs } from '../../services/paiementService';
import Notification from '../commun/Notification';

const PREFIXES = {
  MTN:    ['67','680','681','682','683','650','654','653','652','651',],
  Orange: ['69','689','688','687','686','656','640','655','657','658','659'],
};

function detecterOperateur(tel) {
  const p = tel.substring(0, 2);
  for (const [op, prefixes] of Object.entries(PREFIXES)) {
    if (prefixes.includes(p)) return op;
  }
  return null;
}

const STYLES_OP = {
  MTN:    { badge: { background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' }, texte: '#854d0e' },
  Orange: { badge: { background: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa' }, texte: '#9a3412' },
};

export default function PaiementForm() {
  const [telephone, setTelephone]       = useState('');
  const [erreurLocale, setErreurLocale] = useState(null);
  const [operateurs, setOperateurs]     = useState([]);

  const { etudiant, chargement, debutChargement, finChargement, definirTransaction } = usePaiement();
  const operateurDetecte = telephone.length >= 2 ? detecterOperateur(telephone) : null;

  useEffect(() => {
    getOperateurs()
      .then(setOperateurs)
      .catch(() => setOperateurs([
        { code: 'MTN',    nom: 'MTN Mobile Money' },
        { code: 'ORANGE', nom: 'Orange Money' },
      ]));
  }, []);

  const handleSoumettre = async (e) => {
    e.preventDefault();
    setErreurLocale(null);
    const telNet = telephone.replace(/\s/g, '');
    if (!/^[26][0-9]{8}$/.test(telNet)) {
      setErreurLocale('Numéro invalide — format attendu : 6XXXXXXXX (9 chiffres)');
      return;
    }
    debutChargement();
    try {
      const transaction = await initierPaiement({
        matricule:   etudiant.matricule,
        telephone:   telNet,
        nomEtudiant: etudiant.nom_complet,
        filiere:     etudiant.filiere,
      });
      definirTransaction(transaction);
    } catch (err) {
      setErreurLocale(err.message || 'Erreur lors de l\'initiation du paiement');
      finChargement();
    }
  };

  return (
    <div className="animate-in max-w-xl mx-auto">

      {/* Récap étudiant */}
      {etudiant && (
        <div className="carte p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#dcfce7' }}>
            <span className="font-bold text-sm" style={{ color: '#227838' }}>
              {etudiant.nom_complet?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">{etudiant.nom_complet}</p>
            <p className="text-xs text-gray-500 font-mono">{etudiant.matricule} · {etudiant.filiere}</p>
          </div>
        </div>
      )}

      <div className="carte p-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#dcfce7' }}>
            <svg className="w-5 h-5" style={{ color: '#227838' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Paiement Mobile</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {operateurs.map(o => o.nom || o.code).join(', ')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSoumettre} className="space-y-5">
          {/* Montant */}
          <div className="rounded-xl p-4 border flex items-center justify-between"
            style={{ backgroundColor: '#f0faf2', borderColor: '#86efac' }}>
            <div>
              <p className="text-sm text-gray-600">Montant à payer</p>
              <p className="text-xs text-gray-400 mt-0.5">Montant fixe — non modifiable</p>
            </div>
            <span className="text-2xl font-bold font-mono" style={{ color: '#227838' }}>
              100 000 <span className="text-base">FCFA</span>
            </span>
          </div>

          {/* Numéro */}
          <div>
            <label className="etiquette" htmlFor="telephone">
              Numéro de Paiement 
              {operateurDetecte && (
                <span className="ml-2 font-semibold" style={{ color: STYLES_OP[operateurDetecte]?.texte }}>
                  · {operateurDetecte}
                </span>
              )}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">+237</span>
              <input id="telephone" type="tel"
                className="champ-saisie pl-14 font-mono text-lg tracking-wider"
                placeholder="6XXXXXXXX"
                value={telephone}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val.length <= 9) { setTelephone(val); setErreurLocale(null); }
                }}
                disabled={chargement} maxLength={9} inputMode="numeric" autoFocus />
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              Entrez le numéro qui recevra la demande de paiement
            </p>
          </div>

          {/* Opérateurs */}
          {operateurs.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {operateurs.map((op) => {
                const code = (op.code || '').toUpperCase();
                const cle  = code === 'ORANGE' ? 'Orange' : code === 'MTN' ? 'MTN' : null;
                const estActif = operateurDetecte === cle;
                return (
                  <span key={op.code}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      ...STYLES_OP[cle]?.badge,
                      opacity: estActif ? 1 : 0.55,
                      boxShadow: estActif ? '0 0 0 2px rgba(34,120,56,0.2)' : 'none',
                    }}>
                    {cle}
                  </span>
                );
              })}
            </div>
          )}

          {erreurLocale && (
            <Notification type="erreur" message={erreurLocale} onFermer={() => setErreurLocale(null)} />
          )}

          {/* Instructions */}
          <div className="rounded-xl p-4 border" style={{ backgroundColor: '#f0faf2', borderColor: '#86efac' }}>
            <p className="text-xs font-medium mb-2" style={{ color: '#166534' }}>Comment ça fonctionne :</p>
            <ol className="space-y-1">
              {[
                'Entrez votre numéro Mobile de paiement',
                'Cliquez sur "Initier le paiement"',
                'Validez la demande sur votre téléphone',
                'Recevez votre reçu instantanément',
              ].map((etape, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="font-bold flex-shrink-0" style={{ color: '#227838' }}>{i + 1}.</span>
                  {etape}
                </li>
              ))}
            </ol>
          </div>

          <button type="submit" className="btn-primaire w-full text-base py-4"
            disabled={chargement || telephone.length < 9}>
            {chargement ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Traitement en cours…
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Initier le paiement
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}