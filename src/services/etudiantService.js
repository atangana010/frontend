// services/etudiantService.js
// La recherche du matricule se fait DIRECTEMENT dans Supabase (clé anon)
// sans passer par le backend — lecture publique, RLS autorise SELECT sur etudiants.
import { supabase } from '../config/supabase';

/**
 * Rechercher un étudiant par son matricule
 * @returns {Object|null} Données de l'étudiant, ou null si introuvable
 */
export async function rechercherEtudiant(matricule) {
  const matriculeNet = matricule.trim().toUpperCase();

  const { data, error } = await supabase
    .from('etudiants')
    .select('*')
    .eq('matricule', matriculeNet)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // 0 résultat = pas d'erreur
    console.error('Supabase error:', error);
    throw new Error('Erreur lors de la recherche du matricule');
  }

  return data;
}