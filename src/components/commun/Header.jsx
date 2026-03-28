// components/commun/Header.jsx
import React from 'react';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo + nom université alignés côte à côte */}
        <a
          href="https://www.esign.cm/"
          target="_blank" // ouvre dans un nouvel onglet
          rel="noopener noreferrer"
          className="flex items-center gap-3"
        >
          <img
            src="https://www.esign.cm/images/uiecc_logo_old1.png"
            alt="Logo UIECC"
            className="h-14 w-auto object-contain flex-shrink-0"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-xs font-bold tracking-wide uppercase" style={{ color: '#181616' }}>
              ÉCOLE SUPÉRIEURE
            </span>
            <span className="text-xs font-bold tracking-wide uppercase" style={{ color: '#181616' }}>
              INTERNATIONALE DE GÉNIE
            </span>
            <span className="text-xs font-bold tracking-wide uppercase" style={{ color: '#181616' }}>
              NUMÉRIQUE DE SANGMELIMA
            </span>
          </div>
        </a>

        {/* Badge sécurisé */}
        <div
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border flex-shrink-0"
          style={{ color: '#166534', backgroundColor: '#dcfce7', borderColor: '#86efac' }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Paiement sécurisé
        </div>
      </div>
    </header>
  );
}