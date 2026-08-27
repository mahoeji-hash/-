import { createClient } from '@supabase/supabase-js';

// 브라우저에서 process.env 접근 시 에러가 발생하지 않도록 안전하게 환경변수를 읽어옵니다.
const getEnv = (key: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
};

const supabaseUrl = 
  getEnv('NEXT_PUBLIC_SUPABASE_URL') || 
  getEnv('VITE_SUPABASE_URL') || 
  'https://bjeqocoxyilliqzaktlep.supabase.co';

const supabaseAnonKey = 
  getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') || 
  getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 
  getEnv('VITE_SUPABASE_ANON_KEY') || 
  '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
