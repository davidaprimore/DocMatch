import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
 
if (supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('⚠️ AVISO: Supabase URL está ausente ou mal configurada no Vercel.')
}
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
