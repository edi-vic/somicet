
import { createClient } from '@supabase/supabase-js'

const sbProjectUrl = process.env.SUPABASE_PROJECT_URL
const sbPublicAnonKey = process.env.SUPABASE_PUBLIC_ANON_KEY

const supabase = createClient(
  sbProjectUrl, 
  sbPublicAnonKey
)