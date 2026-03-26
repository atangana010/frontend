// components/commun/Notification.jsx
import React, { useEffect, useState } from 'react';

const configs = {
  succes: {
    icone: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    style: { background: '#dcfce7', border: '1px solid #86efac', color: '#166534' },
  },
  erreur: {
    icone: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    style: { background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b' },
  },
  info: {
    icone: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    style: { background: '#dcfce7', border: '1px solid #86efac', color: '#166534' },
  },
  attente: {
    icone: (
      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    style: { background: '#fef9c3', border: '1px solid #fde047', color: '#854d0e' },
  },
};

export default function Notification({ type = 'info', message, onFermer, duree = 0 }) {
  const [visible, setVisible] = useState(true);
  const config = configs[type] || configs.info;

  useEffect(() => {
    if (duree > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onFermer) onFermer();
      }, duree);
      return () => clearTimeout(timer);
    }
  }, [duree, onFermer]);

  if (!visible || !message) return null;

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl animate-in"
      style={config.style}>
      <span className="flex-shrink-0 mt-0.5">{config.icone}</span>
      <p className="text-sm flex-1">{message}</p>
      {onFermer && (
        <button onClick={() => { setVisible(false); onFermer(); }}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}