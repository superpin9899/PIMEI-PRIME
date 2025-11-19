# PRIME - Sistema de Gamificación

Sistema de gamificación para el programa PRIME de inserción laboral para jóvenes.

## Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Copia `config.json.example` a `config.json`:
```bash
cp config.json.example config.json
```

2. Completa `config.json` con tus credenciales de Supabase:
   - **url**: URL de tu proyecto Supabase (`https://xxxxx.supabase.co`)
   - **serviceKey**: Service Role Secret Key (desde Settings > API > Service Role)
   - **anonKey**: Anon Public Key (para el frontend)

### 3. Primera ejecución en Supabase SQL Editor

**IMPORTANTE**: Antes de ejecutar migraciones, debes ejecutar manualmente la primera migración desde el SQL Editor de Supabase:

1. Ve a tu proyecto Supabase
2. Abre el **SQL Editor**
3. Copia y pega el contenido de `migrations/001_initial_setup.sql`
4. Ejecuta el SQL

Esto creará:
- La función `exec_sql()` que permite ejecutar SQL dinámicamente
- La tabla `cursor_migrations` para controlar las migraciones

### 4. Ejecutar migraciones

Una vez ejecutada la primera migración manualmente, puedes ejecutar el resto automáticamente:

```bash
npm run migrate
```

Este comando:
- Lee todas las migraciones en `migrations/*.sql`
- Verifica cuáles ya están ejecutadas
- Ejecuta solo las nuevas
- Registra cada migración ejecutada

### 5. Crear la cuenta administradora

El panel no expone registro público. Para crear la cuenta inicial (que luego dará de alta al resto de técnicos) usa la API de Supabase Auth:

```bash
# Valores tomados de config.json
$SUPABASE_URL=$(jq -r '.supabase.url' config.json)
$SUPABASE_SERVICE_KEY=$(jq -r '.supabase.serviceKey' config.json)

curl -X POST "$SUPABASE_URL/auth/v1/admin/users" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sistemas@fundacionsanezequiel.org",
    "password": "Fsem1324@",
    "email_confirm": true,
    "user_metadata": {
      "role": "admin",
      "full_name": "Fundación San Ezequiel · Sistemas"
    }
  }'
```

Después inserta el perfil asociado (la migración `004_create_admin_profiles.sql` ya crea la tabla):

```bash
curl -X POST "$SUPABASE_URL/rest/v1/admin_profiles" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '[{
    "user_id": "<UUID devuelto al crear el usuario>",
    "full_name": "Fundación San Ezequiel · Sistemas",
    "role": "admin"
  }]'
```

Credenciales iniciales:

- Email: `sistemas@fundacionsanezequiel.org`
- Contraseña: `Fsem1324@`

### 6. Configurar Supabase en el frontend

El cliente se inicializa leyendo **variables Vite (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)** o, en su defecto, una configuración global expuesta en `window.__SUPABASE_CONFIG__`.

Si prefieres no usar `.env`, añade en `index.html` antes del `<script type="module" src="/src/main.tsx">`:

```html
<script>
  window.__SUPABASE_CONFIG__ = {
    url: 'https://inxjgpzndhtetnctofbs.supabase.co',
    anonKey: 'TU_ANON_KEY_AQUI'
  };
</script>
```

## Estructura del Proyecto

```
PRIME/
├── migrations/          # Migraciones SQL (ejecutadas secuencialmente)
├── scripts/            # Scripts de utilidad (migraciones, etc.)
├── netlify/            # Netlify Functions (backend seguro)
├── src/                # Código frontend
├── config.json         # Credenciales (NO commitear, en .gitignore)
└── package.json
```

## Seguridad

- **Service Role Key**: Solo se usa en scripts locales y Netlify Functions (nunca en el frontend)
- **Anon Key**: Se usa en el frontend con Row Level Security (RLS) configurado
- **config.json**: Está en `.gitignore` y nunca se sube al repositorio

## Despliegue en Netlify

Las credenciales sensibles deben configurarse como **variables de entorno** en Netlify:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY` (solo para funciones serverless)
- `SUPABASE_ANON_KEY` (para el frontend)
- `SUPABASE_SERVICE_KEY` se usa también en `netlify/functions/create-admin-user.ts` para que el admin pueda crear usuarios directamente desde el panel (`/adminusers`).

> 💡 En desarrollo ejecuta `netlify dev` (o configura un proxy equivalente) para disponer de la función `/.netlify/functions/create-admin-user` mientras corres `npm run dev`.

### 7. Bucket de avatares

- Crea un bucket de Supabase Storage llamado **`avatars`** y márcalo como público.
- Las subidas se gestionan a través de `/.netlify/functions/upload-avatar`, por lo que necesitas `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` configuradas (igual que en `create-admin-user`).
- Las imágenes se guardan en `avatars/<user_id>/avatar.ext` y la ruta se actualiza en `prime_users.avatar_path`.

### 8. Formación y experiencia

- Las tablas `user_training` y `user_experience` almacenan las formaciones y empleos del participante.
- Cada usuario solo puede ver/crear/editar/borrar sus propios registros gracias a las políticas RLS incluidas en la migración `008_create_training_experience.sql`.
- Desde `/perfil` ya se renderiza un panel estilo portal de empleo mostrando estos datos.

