import { createClient } from '@supabase/supabase-js';

// Vite 환경변수를 읽어오며, 없을 경우 기본 URL을 사용합니다.
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://bjeqocoxyilliqzaktlep.supabase.co';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
