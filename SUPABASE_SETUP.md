# FonoKids + Supabase

## 1. Configura el proyecto

1. Crea un proyecto en Supabase.
2. En `Authentication > Providers`, deja activo `Email`.
3. Crea manualmente la única usuaria en `Authentication > Users`.
4. Copia tu `Project URL` y tu `anon public key`.
5. Completa [app-config.js](D:\Photoshop\FONOKIDSNUEVO\app-config.js).

## 2. Crea la tabla para guardar el estado

Ejecuta [supabase-schema.sql](D:\Photoshop\FONOKIDSNUEVO\supabase-schema.sql) en el SQL Editor de Supabase.

La app guarda un estado por usuaria en la tabla `app_state`:

- `pacientes`
- `sessions`
- `compra_list`
- `checked_mats`
- `extra_mats`

## 3. Cómo funciona la migración

- Si la app detecta datos locales y una sesión iniciada en Supabase, sube automáticamente ese estado a `app_state`.
- Después sigue guardando localmente y también sincroniza en la nube.
- El botón `Exportar JSON` genera un respaldo manual.

## 4. Login simple

- La pantalla de login aparece solo si `app-config.js` tiene credenciales válidas.
- El inicio de sesión usa `signInWithPassword()` de Supabase.
- La app carga automáticamente el estado remoto de la usuaria autenticada.

Fuente oficial:
- [Supabase Password Auth](https://supabase.com/docs/guides/auth/passwords)
- [Supabase Auth overview](https://supabase.com/docs/guides/auth)

## 5. Resumen semanal por correo

Usa una Edge Function y un cron de Supabase.

### Archivos

- Función: [supabase-weekly-summary.ts](D:\Photoshop\FONOKIDSNUEVO\supabase-weekly-summary.ts)
- Cron SQL: [supabase-cron.sql](D:\Photoshop\FONOKIDSNUEVO\supabase-cron.sql)

### Variables/secretos necesarios

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `WEEKLY_EMAIL_FROM`

### Qué hace

- Lee todas las filas de `app_state`
- Busca el correo del usuario en `auth.users`
- Resume las sesiones de la semana actual
- Envía un correo usando Resend

Fuentes oficiales:
- [Supabase schedule functions](https://supabase.com/docs/guides/functions/schedule-functions)
- [Supabase Cron](https://supabase.com/docs/guides/cron)
- [Resend send email API](https://resend.com/docs/api-reference/emails)

## 6. Despliegue sugerido

1. Instala Supabase CLI.
2. Crea la función `weekly-summary`.
3. Copia el contenido de [supabase-weekly-summary.ts](D:\Photoshop\FONOKIDSNUEVO\supabase-weekly-summary.ts) en la función.
4. Configura los secretos.
5. Despliega la función.
6. Ejecuta [supabase-cron.sql](D:\Photoshop\FONOKIDSNUEVO\supabase-cron.sql).

## 7. Recomendación práctica

Antes de activar el correo semanal en producción:

1. Prueba login.
2. Verifica que la migración desde local funcione.
3. Revisa que `Exportar JSON` baje bien el respaldo.
4. Ejecuta la función manualmente una vez.
