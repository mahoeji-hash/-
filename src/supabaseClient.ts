import { createClient } from '@supabase/supabase-js';

// Vite 및 Next.js 환경변수 읽기
const env = import.meta.env || {};

const supabaseUrl = 
  env.VITE_SUPABASE_URL || 
  env.NEXT_PUBLIC_SUPABASE_URL || 
  'https://bjeqocoxyilliqzaktlep.supabase.co';

// 키 값이 비어있을 경우 화면 전체가 멈추는 현상을 방지하기 위한 임시 키 설정
const supabaseAnonKey = 
  env.VITE_SUPABASE_ANON_KEY || 
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
