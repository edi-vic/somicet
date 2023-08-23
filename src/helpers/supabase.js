import { createClient } from '@supabase/supabase-js'

const sbUrl = import.meta.env.PUBLIC_SUPABASE_URL
const sbKey = import.meta.env.PUBLIC_SUPABASE_KEY

export const supabase = createClient(
  sbUrl, 
  sbKey,
)

export async function getUser(req) {
  console.log('getUser', req)
}

export const isLoggedIn = async () => getUser() != null;