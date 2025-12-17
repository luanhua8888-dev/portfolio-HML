
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rigikfavgndzooebthec.supabase.co'
// Using import.meta.env for Vite. 
// User needs to create a .env file with VITE_SUPABASE_KEY=your_key_here
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZ2lrZmF2Z25kem9vZWJ0aGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NDgxNjcsImV4cCI6MjA4MTUyNDE2N30.-rc8_j1DHbH1g9X9lr7Z0kw5SRdDI4oTANj8z4DDQpY'; // Hardcoded for reliability

export const supabase = createClient(supabaseUrl, supabaseKey)
