import { createClient } from '@supabase/supabase-js'
import cookie from 'cookie'

const sbUrl = import.meta.env.PUBLIC_SUPABASE_URL
const sbKey = import.meta.env.PUBLIC_SUPABASE_KEY

export const supabase = createClient(
  sbUrl, 
  sbKey,
  { 
    auth: { 
      persistSession: false 
    } 
  })

export async function getUser(req) {
  const c = cookie.parse(req.headers.get('cookie') ?? '')
  if (!c.sbat) return null

  const { data, data: { user } } = await supabase.auth.getUser(c.sbat)
  console.log(data)
  if (!user || user.role !== "authenticated") return null
  return user
}

export async function isLoggedIn() {
  return await getUser() != null
}