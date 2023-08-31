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

    return !!data
}

export async function sendEmail(template, email, name) {
  const { data, error } = await supabase
    .functions
    .invoke('mails', { body: JSON.stringify({
      template,
      email,
      name,
    })})
  
  if (error) {
    console.error("Error in sendEmail: ", error)
  } else {
    console.log("Email sent: ", data)
  }
}
