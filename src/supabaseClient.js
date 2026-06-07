import { createClient } from '@supabase/supabase-js';

// Carga las variables de entorno de Vite o usa placeholders si no están definidas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-key';

if (supabaseUrl === 'https://placeholder-project.supabase.co' || supabaseAnonKey.includes('placeholder')) {
  console.warn(
    '⚠️ Supabase: Usando credenciales de placeholder. Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env para conectar con tu base de datos real.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
