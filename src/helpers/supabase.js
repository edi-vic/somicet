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

export async function getAdmin(user) {
  const { data, error } = await supabase
    .from('admins')
    .select()
    .eq('id', user.id)
    .single();

    console.log(data, error)
    return !!data
}
