import { serve } from "https://deno.land/std@0.168.0/http/server.ts"


const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

const handler = async (_request: Request): Promise<Response> => {
  if (_request.method === "OPTIONS"){
    return new Response (null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*", // <-- change here
      }
    })
  }

  console.log("Hello from Functions!")
  const req = await _request.json()
  console.log(req)
  const { name, email } = req
  console.log(name)
  
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "no-reply@somicet.org",
      to: email,
      subject: "hello world",
      html: `<strong>Hello ${name}</strong>`,
    }),
  })

  const data = await res.json()

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*", // <-- change here
    },
  })
}

serve(handler)
