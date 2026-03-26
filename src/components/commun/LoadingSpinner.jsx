// Composant de chargement
import React from 'react';

export default function LoadingSpinner({ message = 'Chargement...', taille = 'md' }) {
  const tailles = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="relative">
        {/* Anneau extérieur animé */}
        <div className={`${tailles[taille]} rounded-full border-2 border-primaire-500/20 border-t-primaire-500 animate-spin`} />
        {/* Point central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-primaire-400 animate-pulse" />
        </div>
      </div>
      {message && (
        <p className="text-sm text-slate-400 animate-pulse">{message}</p>
      )}
    </div>
  );
}