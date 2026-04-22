# Conectar FonoKids a un repo nuevo de GitHub

## Estado actual

El proyecto ya quedó preparado para subirse, pero en esta máquina no hay `git` ni `gh` disponibles en PATH, así que la conexión al repo no se puede ejecutar desde aquí todavía.

## 1. Instalar herramientas

Instala:

- Git for Windows
- GitHub CLI (opcional, pero ayuda mucho)

## 2. Crear el repositorio nuevo en GitHub

En GitHub:

1. Crea un repositorio nuevo.
2. No agregues `README`, `.gitignore` ni licencia si quieres subir este proyecto tal cual.

## 3. Comandos a ejecutar en este proyecto

Abre terminal dentro de:

`D:\Photoshop\FONOKIDSNUEVO`

Y ejecuta:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

## 4. Si usas GitHub CLI

También puedes crear y publicar el repo directamente:

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create TU-REPO --public --source . --remote origin --push
```

## 5. Recomendación importante

Antes de subir credenciales reales:

- deja `app-config.js` sin claves reales, o
- usa un archivo local separado para claves sensibles

Ahora mismo `app-config.js` está con placeholders, así que se puede subir sin problema si no le pones secretos reales.
