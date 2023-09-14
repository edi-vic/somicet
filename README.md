# Sociedad Mexicana para la Investigación en Células Troncales | somicet.org

Web informativa, sistema de registro y panel de administración para el "Simposio: Células Troncales, Medicina Regenerativa y Envejecimiento" del SOMICET.

## Tecnologías utilizadas

- **Frontend**: Astro + Vue.
- **Backend**: Supabase.
- **Correos**: Resend.
- **Control de Versiones**: Git + GitHub.
- **Hosting y Despliegue**: Netlify.

## Variables de entorno (.env)

```bash
PUBLIC_SUPABASE_URL
PUBLIC_SUPABASE_KEY
RESEND_API_KEY
```

## Instalación y desarrollo local

1. Clona el repositorio

```bash
git clone git@github.com:edi-vic/somicet.git
```

2. Instala las dependencias

```bash
npm install
```

3. Ejecuta e proyecto localmente:

```bash
npm run dev
```

## Despliegue

El despliegue se realiza automáticamente a través de Netlify al hacer push a las ramas principal y de desarrollo:

```bash
main - somicet.org
dev - dev.somicet.org
```

Despliegue de función que maneja correos:

```bash
supabase functions deploy mails --project-ref dvehcomkytvfptmklezb
```

## Base de Datos

- [Ver Tablas](docs/tables.md)
- [Ver Funciones](docs/functions.md)


---
© 2023 Sociedad Mexicana para la Investigación de Células Troncales (SOMICET). Todos los derechos reservados.