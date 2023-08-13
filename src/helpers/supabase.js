import { createClient } from '@supabase/supabase-js'
import { session } from '@stores/session'
import cookie from 'cookie'

const sbUrl = import.meta.env.PUBLIC_SUPABASE_URL
const sbKey = import.meta.env.PUBLIC_SUPABASE_KEY

export const supabase = createClient(
  sbUrl, 
  sbKey,
)

export async function getUser() {
  const { data, error, data: { user } } = await supabase.auth.getUser()
  console.log(data, error)
  if (!user || user.role !== "authenticated") return null
  return user
}

export async function isLoggedIn() {
  return await getUser() != null
}