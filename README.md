## Datos del proyecto

- Nombre: Rendon Cocom Saul Alejandro
- Matrícula: 24393121
- Grupo: LITIId52

## Descripción

Aplicación tipo Pokédex con login de entrenador, captura de Pokémon y almacenamiento en Supabase. Usa React + Vite, Tailwind para estilos, Mapbox para mostrar marcadores aleatorios y la PokéAPI para datos y sprites.

## Características

- Login: selección de avatar, generación de ID y persistencia de entrenador en localStorage.
- Pokédex: encendido/apagado, búsqueda por nombre o ID, modo retro/arte oficial, probabilidad de shiny/legendario y captura con envío a Supabase.
- Dashboard: mapa Mapbox con marcadores de sprites aleatorios y estadísticas de capturas (total, shinies, tipos únicos) por entrenador.
- Pokebox: lista, búsqueda, renombrado y borrado de Pokémon guardados en Supabase, vista de tarjeta de entrenador con conteos.
- Integraciones: Supabase (tabla `pokemons`), PokéAPI para datos, Mapbox para mapa, React Router para navegación.

## Rutas principales

- `/` login y selección de avatar.
- `/dashboard` mapa y estadísticas del entrenador activo.
- `/pokedex` búsqueda/captura y enciclopedia.
- `/pokebox` gestión de Pokémon almacenados.

## Stack y dependencias clave

- React + Vite, React Router DOM.
- Supabase (`@supabase/supabase-js`) para persistencia.
- PokéAPI (fetch directo) para datos de Pokémon.
- Mapbox GL para mapa temático.
- Tailwind y estilos custom (gradientes, holográfico, retro sprites).

## Puesta en marcha

Requisitos: Node 18+ y npm.

```bash
npm install
npm run dev
```

## Configuración de servicios

### Supabase

- Copia `.env.example` a `.env` y rellena `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- El cliente lee las variables desde `import.meta.env` en `src/pages/client.js` (y la copia en `supabase/client copy.js`).
- Tabla esperada: `pokemons` con columnas sugeridas:
	- `id` bigint/serial (PK)
	- `name` text
	- `type` text (ej. "fire / flying")
	- `image` text (url sprite)
	- `trainer` text
	- `rarity` text (normal|shiny|legendary|epic)
	- `is_shiny` boolean
	- `level` integer
	- `created_at` timestamptz default now()

### Mapbox

- Define `VITE_MAPBOX_TOKEN` en `.env`. `src/pages/dashboard.jsx` y `my-map-app/src/App.jsx` lo leen desde `import.meta.env`.


## Flujo de uso

1) Ingresa nombre y avatar en el login (se guarda en localStorage).
2) En Pokédex enciende el dispositivo, busca o genera aleatorios y captura; cada captura se envía a Supabase.
3) Revisa estadísticas y marcadores en el dashboard.
4) Gestiona tus capturas en Pokebox (buscar, renombrar, eliminar).

