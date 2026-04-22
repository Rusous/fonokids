# FonoKids: versión estable y versión cloud

## Archivos

- Estable actual: [index.html](D:\Photoshop\FONOKIDSNUEVO\index.html)
- Experimental cloud: [index-cloud.html](D:\Photoshop\FONOKIDSNUEVO\index-cloud.html)

## Regla de trabajo

- `index.html` se mantiene funcional y sin cambios riesgosos.
- `index-cloud.html` se usa para integrar Supabase, login y correo semanal.

## Próximo objetivo

Implementar en `index-cloud.html`:

1. conexión a Supabase sin bloquear la UI
2. login opcional
3. sincronización manual primero
4. recién después sincronización automática

## Importante

No usar `index-cloud.html` como versión principal hasta que:

- cargue bien
- mantenga calendario y botones
- permita login sin romper la app
- guarde y recupere datos correctamente
