// services/api.js — Client HTTP vers le backend
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || "https://backend-ritw.onrender.com";

const api = axios.create({
  baseURL: apiUrl,
  timeout: 35000, // 35s — légèrement supérieur au timeout backend (30s)
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur réponse — normalise les erreurs
api.interceptors.response.use(
  (reponse) => reponse,
  (erreur) => {
    // Erreur réseau (backend éteint, CORS, timeout)
    if (!erreur.response) {
      const msg = erreur.code === 'ECONNABORTED'
        ? 'Le serveur met trop de temps à répondre. Réessayez.'
        : 'Impossible de contacter le serveur. Vérifiez votre connexion.';
      return Promise.reject(new Error(msg));
    }

    // Erreur HTTP avec message du backend
    const message =
      erreur.response.data?.message ||
      erreur.response.data?.erreur ||
      `Erreur serveur (${erreur.response.status})`;

    return Promise.reject(new Error(message));
  }
);

export default api;