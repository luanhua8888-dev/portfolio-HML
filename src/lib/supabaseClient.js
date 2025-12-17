
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rigikfavgndzooebthec.supabase.co'
// Using import.meta.env for Vite. 
// User needs to create a .env file with VITE_SUPABASE_KEY=your_key_here
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey)
