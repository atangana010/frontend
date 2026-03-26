// components/commun/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-16 py-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-xs text-gray-500">
          Propulsé par{' '}
          <span className="font-medium" style={{ color: '#227838' }}>UIECC</span>
          {' '}· BP 174 Sangmélima Sud Cameroun
        </p>
        <p className="text-xs text-gray-400 mt-1">
          © {new Date().getFullYear()} UIECC — Tous droits réservés
        </p>
      </div>
    </footer>
  );
}