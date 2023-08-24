import { createClient } from "@supabase/supabase-js";

const sbUrl = import.meta.env.PUBLIC_SUPABASE_URL
const sbKey = import.meta.env.PUBLIC_SUPABASE_KEY

export const supabase = createClient(
  sbUrl, 
  sbKey,
)

export async function getUser(req) {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const match = cookie.match(/sbat=([^;]+)/);
  const sbat = match?.[1];
  if (!sbat) return null;

  const { data: { user } } = await supabase.auth.getUser(sbat);
  if (!user || user.role !== "authenticated") return null;
  return user;
}

export async function getUserRole(user) {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('user_id', user.id)
    .single();

    console.log(data, error)
}
