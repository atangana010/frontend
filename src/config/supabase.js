// frontend/src/config/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase credentials manquantes');
}

// Client avec clé anon (pour les opérations publiques - frontend uniquement)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

// Fonction pour vérifier un matricule directement depuis le frontend
export const verifierMatriculeDirect = async (matricule) => {
  try {
    const { data, error } = await supabase
      .from('etudiants')
      .select('*')
      .eq('matricule', matricule.toUpperCase().trim())
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return { existe: false, etudiant: null };
      }
      throw error;
    }
    
    return { 
      existe: true, 
      etudiant: data 
    };
  } catch (error) {
    console.error('Erreur vérification:', error);
    throw error;
  }
};