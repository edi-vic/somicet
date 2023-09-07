import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

const SUBJECTS = {
  "payment-accepted": "Confirmación de Pago - Simposio SOMICET",
  "payment-rejected": "Problema con tu Pago - Simposio SOMICET",
  "poster-accepted": "Confirmación de Cartel - Simposio SOMICET",
  "poster-rejected": "Aviso sobre tu Cartel - Simposio SOMICET",
}

const TEMPLATES = {
  "payment-accepted": `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta name="x-apple-disable-message-reformatting">
      <title>Pago aceptado</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        table, td, div, h1, p {font-family: Arial, sans-serif;}
      </style>
    </head>
    <body style="margin:0;padding:0;">
      <table role="presentation" style="width: 100%; max-width:660px;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff; margin-left:auto; margin-right: auto;">
        <tr>
          <td align="center" style="padding:0;">
            <table  style="width:100%;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
              <tr>
                <td align="center" style="padding:40px 0 0;background:#ffff;">
                  <img src="https://dvehcomkytvfptmklezb.supabase.co/storage/v1/object/public/assets/logo.png" alt="" width="117" style="height:auto;display:block;" />
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:3% 15%; font-weight:medium; font-size:20px ">
                  <h3>
                    Sociedad Mexicana para la Investigación en Células Troncales       
                  </h3>
                </td>
              </tr>
              <tr>
                <td style="padding:3% 9%">
                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                    <tr>
                      <td style="padding:0 0 36px 0;color:#153643;">
                        <p style="font-size:16px;margin:0 0 20px 0;font-family:Arial,sans-serif;font-weight:medium; ">Estimad@ [[user_name]]:</p>
                        <p style="font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Su pago para el Simposio "Células Troncales, Medicina Regenerativa y Envejecimiento" ha sido confirmado con éxito.</p>
                        <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Si desea registrar un cartel, por favor haga clic en el botón a continuación.
                          
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding:0 9% 3%;">
                        <button style="width: 200px; height: 50px; border: none; border-radius:8px; background:#BF2604;box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.35);">
                          <a href="https://somicet.org/registro/cartel" style="text-decoration:none; color:#fff; font-size: 14px;"> Registrar cartel</a>
                        </button>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:0 9% 6%;font-weight:light;">
                  <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">
                    
                    Si desea solicitar una factura, puede hacerlo a través de la plataforma haciendo clic en este 
                    <a href="https://somicet.org/registro/formulario" style="cursor: pointer; text-decoration: none; color:#BF2604; font-weight: bold;">
                      
                      enlace.
                    </a>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 9% 6%;font-weight:light; font-size:14px;">
                  Saludos Cordiales,
              
                  
                </td>
              </tr>
              <tr>
                <td style="padding:0 9% 6%";>
                  <table>
                    <tr>
                      <td>
                        <img src="https://dvehcomkytvfptmklezb.supabase.co/storage/v1/object/public/assets/support.png"/>
                        
                      </td>
                      <td style="font-size: 12px; padding-left:6px;">
                        Si tiene dudas, contactanos <br>
                        <a href="mailto:somicet@gmail.com" style="text-decoration: none; color:#BF2604; font-weight: bold; ">
                          somicet@gmail.com
                        </a>
                      </td>
                      
                    </tr>
                  </table>
                </td>
                
              </tr>
              <tr>
                <td style="background:#BF2604; height: 110px;">
                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:12px;font-family:Arial,sans-serif;" align="center">
                    <tr>
                        </a>
                      <td style="padding:15px 0;width:100%; color: #ffff;" align="center">
                      <a href="https://www.facebook.com/SOMICET/?locale=es_LA">
                        <img src="https://dvehcomkytvfptmklezb.supabase.co/storage/v1/object/public/assets/facebook.png" alt="Facebook"  style="height:auto;display:block;border:0; width:30px; height: 30px; margin-bottom:10px;" />
                        </a>
                        <a href="https://somicet.org/" style="text-decoration: none; color: #ffff; font-size: 16px;">somicet.org</a>
                        <p style="margin: 10px 0 0; font-size:10px;">
                          SOMICET 2023 
                        </p>
                      
                      </td>
                      
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  "payment-rejected": `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta name="x-apple-disable-message-reformatting">
      <title></title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        table, td, div, h1, p {font-family: Arial, sans-serif;}
      </style>
    </head>
    <body style="margin:0;padding:0;">
      <table role="presentation" style="width: 100%; max-width:660px;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff; margin-left:auto; margin-right: auto;">
        <tr>
          <td align="center" style="padding:0;">
            <table  style="width:100%;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
              <tr>
                <td align="center" style="padding:40px 0 0;background:#ffff;">
                  <img src="https://dvehcomkytvfptmklezb.supabase.co/storage/v1/object/public/assets/logo.png" alt="" width="117" style="height:auto;display:block;" />
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:3% 15%; font-weight:medium; font-size:20px;">
                  <h3>
            Sociedad Mexicana para la Investigación en Células Troncales       
                  </h3>
                </td>
              </tr>
              <tr>
                <td style="padding:3% 9%">
                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                    <tr>
                      <td style="padding:0 0 36px 0;color:#153643;">
                        <p style="font-size:16px;margin:0 0 20px 0;font-family:Arial,sans-serif;font-weight:medium; ">Estimad@ [[user_name]]:</p>
                        <p style="font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Lamentamos informarle que su pago para el Simposio "Células Troncales, Medicina Regenerativa y Envejecimiento" ha sido rechazado debido a la detección de una irregularidad en su proceso.</p>
                        <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">
                        No se preocupe, puede resolverlo accediendo nuevamente a la plataforma y corrigiendo el paso mencionado.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding:0 9% 3%;">
                        <button style="width: 200px; height: 50px; border: none; border-radius:8px; background:#BF2604;box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.35);">
                          <a href="https://somicet.org/registro" style="text-decoration:none; color:#fff; font-size: 14px;">Ir a la plataforma</a>
                        </button>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <tr>
                <td style="padding:0 9% 6%;font-weight:light; font-size:14px;">
                  Saludos Cordiales,
              
                  
                </td>
              </tr>
              <tr>
                <td style="padding:0 9% 6%";>
                  <table>
                    <tr>
                      <td>
                        <img src="https://dvehcomkytvfptmklezb.supabase.co/storage/v1/object/public/assets/support.png"/>
                        
                      </td>
                      <td style="font-size: 12px; padding-left:6px;">
                        Si tiene dudas, contactanos  <br>
                        <a href="mailto:somicet@gmail.com" style="text-decoration: none; color:#BF2604; font-weight: bold; ">
                          somicet@gmail.com
                        </a>
                      </td>
                      
                    </tr>
                  </table>
                </td>
                
              </tr>
              <tr>
                <td style="background:#BF2604; height: 110px;">
                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:12px;font-family:Arial,sans-serif;" align="center">
                    <tr>
                        </a>
                      <td style="padding:15px 0;width:100%; color: #ffff;" align="center">
                      <a href="https://www.facebook.com/SOMICET/?locale=es_LA">
                        <img src="https://dvehcomkytvfptmklezb.supabase.co/storage/v1/object/public/assets/facebook.png" alt="Facebook"  style="height:auto;display:block;border:0; width:30px; height: 30px; margin-bottom:10px;" />
                        </a>
                        <a href="somicet.org" style="text-decoration: none; color: #ffff; font-size: 16px;">somicet.org</a>
                        <p style="margin: 10px 0 0; font-size:10px;">
                          SOMICET 2023 
                        </p>
                      
                      </td>
                      
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  "poster-accepted": `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta name="x-apple-disable-message-reformatting">
      <title></title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        table, td, div, h1, p {font-family: Arial, sans-serif;}
      </style>
    </head>
    <body style="margin:0;padding:0;">
      <table role="presentation" style="width: 100%; max-width:660px;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff; margin-left:auto; margin-right: auto;">
        <tr>
          <td align="center" style="padding:0;">
            <table  style="width:100%;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
              <tr>
                <td align="center" style="padding:40px 0 0;background:#ffff;">
                  <img src="https://dvehcomkytvfptmklezb.supabase.co/storage/v1/object/public/assets/logo.png" alt="" width="117" style="height:auto;display:block;" />
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:3% 15%; font-weight:medium; font-size:20px;">
                  <h3>
            Sociedad Mexicana para la Investigación en Células Troncales       
                  </h3>
                </td>
              </tr>
              <tr>
                <td style="padding:3% 9%">
                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                    <tr>
                      <td style="padding:0 0 36px 0;color:#153643;">
                        <p style="font-size:16px;margin:0 0 20px 0;font-family:Arial,sans-serif;font-weight:medium; ">Estimad@ [[user_name]]:</p>
                                        <p style="font-size:16px;line-height:20px;font-family:Arial,sans-serif;">
                                            Le informamos que posterior al proceso de evaluación su trabajo fue seleccionado para participar en el Simposio "Células Troncales, Medicina Regenerativa y Envejecimiento" en la modalidad de cartel.
                                        </p>
                                        <p style="font-size:16px;line-height:20px;font-family:Arial,sans-serif;">
                                            Su número de poster es 
                                            <span style="font-weight: bold;">
                                                [[poster_number]]
                                            </span>
                                            y deberá presentar los días:
                                        </p>
                                        <ul>
                                          <li style="margin: 0 0 10px;">
                                            Jueves, 19 de octubre de 2023 de 12:30 a 14:00 hrs.
                                          </li>
                                          <li style="margin: 0 0 10px;">
                                            Viernes, 20 de octubre de 2023 de 11:00 a 12:00 hrs.
                                          </li>
                                        </ul>
                                        <p style="margin:0;font-size:16px;line-height:20px;font-family:Arial,sans-serif;">
                                            Enseguida le enlistamos los requerimientos para la presentación de su proyecto:
                                        </p>
                      </td>
                    </tr>
                                    <tr>
                                    <td>
                                        <ul style="list-style: number; font-size:16px; line-height: 20px;">
                                            <li style="margin: 10px 0;">
                                                Las medidas máximas: 150 cm de alto por 100 cm de ancho.
                                            </li>
                                            <li style="margin: 0 0 10px;">
                                                El cartel debe de tener el siguiente contenido:
                                                <ul style="font-size: 14px;">
                                                    <li style="margin: 10px 0;">
                                                        Resumen
                                                    </li>
                                                    <li style="margin:0 0 10px;">
                                                        Introducción
                                                    </li>
                                                    <li style="margin:0 0 10px;">
                                                        Metodología y Resultados
                                                    </li>
                                                    <li style="margin:0 0 10px;">
                                                        Conclusiones y perspectivas
                                                    </li>
                                                    <li style="margin:0 0 10px;">
                                                        Agradecimientos
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                  </table>
                </td>
              </tr>
              
              <tr>
                <td style="padding:0 9% 6%;font-weight:light; font-size:14px;">
                  Saludos cordiales,
              
                  
                </td>
              </tr>
              <tr>
                <td style="padding:0 9% 6%";>
                  <table>
                    <tr>
                      <td>
                        <img src="https://dvehcomkytvfptmklezb.supabase.co/storage/v1/object/public/assets/support.png"/>
                        
                      </td>
                      <td style="font-size: 12px; padding-left:6px;">
                        Si tiene dudas, contactanos  <br>
                        <a href="mailto:somicet@gmail.com" style="text-decoration: none; color:#BF2604; font-weight: bold; ">
                          somicet@gmail.com
                        </a>
                      </td>
                      
                    </tr>
                  </table>
                </td>
                
              </tr>
              <tr>
                <td style="background:#BF2604; height: 110px;">
                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:12px;font-family:Arial,sans-serif;" align="center">
                    <tr>
                        </a>
                      <td style="padding:15px 0;width:100%; color: #ffff;" align="center">
                      <a href="https://www.facebook.com/SOMICET/?locale=es_LA">
                        <img src="https://dvehcomkytvfptmklezb.supabase.co/storage/v1/object/public/assets/facebook.png" alt="Facebook"  style="height:auto;display:block;border:0; width:30px; height: 30px; margin-bottom:10px;" />
                        </a>
                        <a href="somicet.org" style="text-decoration: none; color: #ffff; font-size: 16px;">somicet.org</a>
                        <p style="margin: 10px 0 0; font-size:10px;">
                          SOMICET 2023 
                        </p>
                      
                      </td>
                      
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  "poster-rejected": `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta name="x-apple-disable-message-reformatting">
      <title></title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        table, td, div, h1, p {font-family: Arial, sans-serif;}
      </style>
    </head>
    <body style="margin:0;padding:0;">
      <table role="presentation" style="width: 100%; max-width:660px;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff; margin-left:auto; margin-right: auto;">
        <tr>
          <td align="center" style="padding:0;">
            <table  style="width:100%;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
              <tr>
                <td align="center" style="padding:40px 0 0;background:#ffff;">
                  <img src="https://dvehcomkytvfptmklezb.supabase.co/storage/v1/object/public/assets/logo.png" alt="" width="117" style="height:auto;display:block;" />
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:3% 15%; font-weight:medium; font-size:20px;">
                  <h3>
            Sociedad Mexicana para la Investigación en Células Troncales       
                  </h3>
                </td>
              </tr>
              <tr>
                <td style="padding:3% 9%">
                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                    <tr>
                      <td style="padding:0 0 36px 0;color:#153643;">
                        <p style="font-size:16px;margin:0 0 20px 0;font-family:Arial,sans-serif;font-weight:medium; ">Estimad@ [[user_name]]:</p>
                                        <p style="font-size:16px;line-height:20px;font-family:Arial,sans-serif;">
                                            Le informamos que posterior al proceso de evaluación su trabajo no fue seleccionado para participar
                                            en el Simposio “Células Troncales, Medicina Regenerativa y Envejecimiento” en la modalidad de cartel.
                                        </p>
                                        <p style="font-size:16px;line-height:20px;font-family:Arial,sans-serif;">
                                            Aunque su propuesta no fue seleccionada en esta ocasión, agradecemos su interés en el Simposio y lo invitamos a participar como asistente, lo cual también podrá generarle una constancia.
                                        </p>
                                        <p style="margin:0;font-size:16px;line-height:20px;font-family:Arial,sans-serif;">
                                          En caso contrario, puede solicitar la devolución de su pago de inscripción a <a href="mailto:somicet@gmail.com" style="text-decoration: none; color:#BF2604; font-weight: bold; ">
                          somicet@gmail.com</a>, adjuntando su comprobante de pago y la cuenta a la que requiere la devolución, 
                          <span style="font-weight:bold;">
    
                          siempre y cuando no haya solicitado factura. 
                          </span>
                                        </p>
                      </td>
                    </tr>
                                    <tr>
                                    
                                </tr>
                  </table>
                </td>
              </tr>
              
              <tr>
                <td style="padding:0 9% 6%;font-weight:light; font-size:14px;">
                  Saludos cordiales,
              
                  
                </td>
              </tr>
              <tr>
                <td style="padding:0 9% 6%";>
                  <table>
                    <tr>
                      <td>
                        <img src="https://dvehcomkytvfptmklezb.supabase.co/storage/v1/object/public/assets/support.png"/>
                        
                      </td>
                      <td style="font-size: 12px; padding-left:6px;">
                        Si tiene dudas, contactanos  <br>
                        <a href="mailto:somicet@gmail.com" style="text-decoration: none; color:#BF2604; font-weight: bold; ">
                          somicet@gmail.com
                        </a>
                      </td>
                      
                    </tr>
                  </table>
                </td>
                
              </tr>
              <tr>
                <td style="background:#BF2604; height: 110px;">
                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:12px;font-family:Arial,sans-serif;" align="center">
                    <tr>
                        </a>
                      <td style="padding:15px 0;width:100%; color: #ffff;" align="center">
                      <a href="https://www.facebook.com/SOMICET/?locale=es_LA">
                        <img src="https://dvehcomkytvfptmklezb.supabase.co/storage/v1/object/public/assets/facebook.png" alt="Facebook"  style="height:auto;display:block;border:0; width:30px; height: 30px; margin-bottom:10px;" />
                        </a>
                        <a href="somicet.org" style="text-decoration: none; color: #ffff; font-size: 16px;">somicet.org</a>
                        <p style="margin: 10px 0 0; font-size:10px;">
                          SOMICET 2023 
                        </p>
                      
                      </td>
                      
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

const handler = async (_request: Request): Promise<Response> => {
  if (_request.method === "OPTIONS"){
    return new Response (null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*", // <-- change here
      }
    })
  }

  const req = await _request.json()
  const { template, name, email, poster } = req
  let templateHTML = TEMPLATES[template]
  if (name) templateHTML = templateHTML.replace("[[user_name]]", name)
  if (poster) {
    templateHTML = templateHTML.replace("[[poster_number]]", poster.number)
  }
  const subject = SUBJECTS[template]
  
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "no-reply@somicet.org",
      to: email,
      reply_to: "somicet@gmail.com",
      subject: subject,
      html: templateHTML,
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
