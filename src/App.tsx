import React from 'react';
import { PaiementProvider, usePaiement } from './contexts/PaiementContext';
import Header from './components/commun/Header';
import Footer from './components/commun/Footer';
import VerificationMatricule from './components/etudiant/VerificationMatricule';
import PaiementForm from './components/paiement/PaiementForm';
import SuiviPaiement from './components/paiement/SuiviPaiement';
import RecuPaiement from './components/paiement/RecuPaiement';

type Etape = 'verification' | 'paiement' | 'suivi' | 'confirmation';

function IndicateurEtapes({ etapeActive }: { etapeActive: Etape }) {
  const etapes: { id: Etape; label: string }[] = [
    { id: 'verification', label: 'Vérification' },
    { id: 'paiement',     label: 'Paiement'     },
    { id: 'suivi',        label: 'Suivi'         },
    { id: 'confirmation', label: 'Confirmation'  },
  ];

  const indexActif = etapes.findIndex((e) => e.id === etapeActive);

  return (
    <div className="flex items-center justify-center mb-10">
      {etapes.map((etape, index) => {
        const estComplete = index < indexActif;
        const estActif    = index === indexActif;

        return (
          <React.Fragment key={etape.id}>
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={
                  estComplete ? { backgroundColor: '#227838', color: '#fff' } :
                  estActif    ? { backgroundColor: '#eab308', color: '#fff', boxShadow: '0 0 0 4px rgba(234,179,8,0.2)' } :
                                { backgroundColor: '#e5e7eb', color: '#9ca3af', border: '1px solid #d1d5db' }
                }
              >
                {estComplete ? '✓' : index + 1}
              </div>
              <span
                className="text-xs hidden sm:block transition-colors duration-300"
                style={
                  estActif    ? { color: '#1a2e1a', fontWeight: 500 } :
                  estComplete ? { color: '#227838' } :
                                { color: '#9ca3af' }
                }
              >
                {etape.label}
              </span>
            </div>

            {index < etapes.length - 1 && (
              <div
                className="w-12 sm:w-20 h-px mx-1 sm:mx-2 transition-all duration-500"
                style={{ backgroundColor: index < indexActif ? '#227838' : '#e5e7eb' }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ContenuPrincipal() {
  const { etape } = usePaiement();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 min-h-screen">
      <IndicateurEtapes etapeActive={etape as Etape} />
      {etape === 'verification' && <VerificationMatricule />}
      {etape === 'paiement'     && <PaiementForm />}
      {etape === 'suivi'        && <SuiviPaiement />}
      {etape === 'confirmation' && <RecuPaiement />}
    </main>
  );
}

export default function App() {
  return (
    <PaiementProvider>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8faf8' }}>
        <Header />
        <ContenuPrincipal />
        <Footer />
      </div>
    </PaiementProvider>
  );
}