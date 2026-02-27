import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './client.js';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2F1bHJlbiIsImEiOiJjbWw3MnZkc3Ewam8yM2Vwdnp1bGwwdG95In0.ySJDgjkHnYK9dFFfsNfG2w';
const MAP_INITIAL_CENTER = [-86.8685, 21.1498];
const MAP_INITIAL_ZOOM = 10.12;

const PokemonDashboard = () => {
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState('');
  const [avatar, setAvatar] = useState('');
  const [stats, setStats] = useState({ captured: 0, shinies: 0, categories: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const initializedRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [markersLoading, setMarkersLoading] = useState(false);
  const [markersError, setMarkersError] = useState('');
  const statusText = useMemo(() => {
    if (markersError) return markersError;
    if (markersLoading) return 'Cargando marcadores…';
    if (!mapReady) return 'Cargando mapa…';
    return 'Marcadores con sprites aleatorios de la PokéAPI.';
  }, [mapReady, markersLoading, markersError]);

  useEffect(() => {
    const storedTrainer = localStorage.getItem('trainer_current');
    if (!storedTrainer) {
      navigate('/');
      return;
    }

    setTrainer(storedTrainer);
    setAvatar(localStorage.getItem('trainer_avatar') || '');
    fetchStats(storedTrainer);
  }, [navigate]);

  const fetchStats = async (trainerName) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pokemons')
        .select('type,is_shiny')
        .eq('trainer', trainerName);

      if (error) throw error;

      const captured = data?.length || 0;
      const shinies = (data || []).filter((p) => p.is_shiny).length;
      const categories = new Set();
      (data || []).forEach((p) => {
        (p.type || '')
          .split('/')
          .map((t) => t.trim())
          .filter(Boolean)
          .forEach((t) => categories.add(t));
      });

      setStats({ captured, shinies, categories: categories.size });
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
      setStats({ captured: 0, shinies: 0, categories: 0 });
    } finally {
      setLoading(false);
    }
  };

  const greeting = useMemo(() => {
    if (!trainer) return 'Entrenador';
    const first = trainer.trim().split(' ')[0];
    return first.charAt(0).toUpperCase() + first.slice(1);
  }, [trainer]);

  const randomCoordinateNearby = () => {
    const [lng, lat] = MAP_INITIAL_CENTER;
    const lngOffset = (Math.random() - 0.5) * 0.6;
    const latOffset = (Math.random() - 0.5) * 0.4;
    return [lng + lngOffset, lat + latOffset];
  };

  const placeRandomPokemonMarkers = useCallback(async () => {
    if (!mapRef.current) return;

    setMarkersLoading(true);
    setMarkersError('');

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const randomIds = Array.from({ length: 6 }, () => Math.floor(Math.random() * 151) + 1);

    try {
      const pokemonList = await Promise.all(
        randomIds.map(async (id) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          if (!res.ok) throw new Error('No se pudo cargar un Pokémon');
          const data = await res.json();
          const sprite =
            data.sprites?.other?.['official-artwork']?.front_default || data.sprites?.front_default;
          return { name: data.name, sprite };
        })
      );

      pokemonList
        .filter((p) => p.sprite)
        .forEach((pokemon) => {
          const el = document.createElement('div');
          el.style.width = '48px';
          el.style.height = '48px';
          el.style.borderRadius = '12px';
          el.style.overflow = 'hidden';
          el.style.border = '2px solid #7dd3fc';
          el.style.background = '#0b1220';

          const img = document.createElement('img');
          img.src = pokemon.sprite;
          img.alt = pokemon.name;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'contain';
          el.appendChild(img);

          const [lng, lat] = randomCoordinateNearby();
          const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([lng, lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 12 }).setHTML(
                `<div style="text-transform: capitalize; font-weight: 600;">${pokemon.name}</div><div style="font-size: 12px; color: #a5b4fc;">${lng.toFixed(3)}, ${lat.toFixed(3)}</div>`
              )
            )
            .addTo(mapRef.current);

          markersRef.current.push(marker);
        });
    } catch (err) {
      setMarkersError('No se pudieron cargar los marcadores.');
    } finally {
      setMarkersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initializedRef.current || !mapContainerRef.current) return;
    initializedRef.current = true;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: MAP_INITIAL_CENTER,
      zoom: MAP_INITIAL_ZOOM,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      requestAnimationFrame(() => map.resize());
      setMapReady(true);
      placeRandomPokemonMarkers();
    });

    map.on('error', () => {
      setMapReady(true);
      setMarkersError('No se pudo cargar el mapa. Revisa tu token o conexión.');
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
      initializedRef.current = false;
    };
  }, [placeRandomPokemonMarkers]);

  const fetchPokemon = async () => {
    if (!searchTerm.trim()) return;
    try {
      setSearching(true);
      setSearchMessage('');
      setSearchResult(null);

      const target = searchTerm.trim().toLowerCase();
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${target}`);
      if (!res.ok) throw new Error('No encontrado');
      const data = await res.json();

      const baseSprite = data.sprites?.other?.['official-artwork']?.front_default || data.sprites?.front_default;
      const shinySprite = data.sprites?.other?.['official-artwork']?.front_shiny || data.sprites?.front_shiny || baseSprite;
      const isShiny = Math.random() < 0.1;

      setSearchResult({
        id: data.id,
        name: data.name.toUpperCase(),
        type: data.types.map((t) => t.type.name).join(' / '),
        sprite: isShiny ? shinySprite : baseSprite,
        isShiny,
      });
    } catch (err) {
      setSearchMessage('Pokémon no encontrado, intenta otro nombre o ID.');
    } finally {
      setSearching(false);
    }
  };

  const handleCatch = async () => {
    if (!searchResult) return;
    if (!trainer) {
      setSearchMessage('Configura un entrenador antes de capturar.');
      return;
    }

    try {
      setSearching(true);
      setSearchMessage('');

      const payload = {
        name: searchResult.name,
        type: searchResult.type,
        image: searchResult.sprite,
        trainer,
        rarity: searchResult.isShiny ? 'shiny' : 'normal',
        is_shiny: !!searchResult.isShiny,
        level: 1,
      };

      const { error } = await supabase.from('pokemons').insert([payload]);
      if (error) throw error;

      setSearchMessage('Guardado en tu Pokebox');
    } catch (err) {
      setSearchMessage('No se pudo guardar, intenta de nuevo.');
    } finally {
      setSearching(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('trainer_current');
    localStorage.removeItem('trainer_avatar');
    localStorage.removeItem('trainer_avatar_idx');
    navigate('/');
  };

  const quickNavigate = (path) => navigate(path);

  return (
    <div className="flex min-h-screen bg-black text-white font-sans p-4">
      <aside className="w-72 border-2 border-pink-900/50 bg-[#1b1111] rounded-l-lg flex flex-col p-6">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl border-2 border-green-500/80 bg-black">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="h-full w-full object-contain" />
              ) : (
                <div className="h-full w-full grid place-items-center text-sm text-green-300">PKM</div>
              )}
            </div>
            <div>
              <p className="text-xs text-pink-200/70 uppercase tracking-[0.2em]">Entrenador</p>
              <p className="text-xl font-bold text-pink-200">{greeting}</p>
            </div>
          </div>

          <nav className="space-y-3 text-lg font-medium">
            <button onClick={() => quickNavigate('/dashboard')} className="block text-left w-full hover:text-pink-400">Dashboard</button>
            <button onClick={() => quickNavigate('/pokedex')} className="block text-left w-full hover:text-pink-400">Pokédex</button>
            <button onClick={() => quickNavigate('/pokebox')} className="block text-left w-full hover:text-pink-400">Pokebox</button>
            <button onClick={() => quickNavigate('/')} className="block text-left w-full hover:text-pink-400">Configuración</button>
          </nav>
        </div>

        <div className="mt-auto">
          <button onClick={handleLogout} className="text-lg hover:text-red-400 transition-colors">Salir</button>
        </div>
      </aside>

      <main className="flex-1 border-2 border-pink-900/50 border-l-0 rounded-r-lg p-8 flex flex-col bg-[#0d0b14]">
        <header className="border-2 border-pink-900/50 p-4 rounded-md mb-8 flex items-center justify-between bg-[#16111f]">
          <div>
            <h1 className="text-xl text-pink-300">Bienvenido, {greeting}</h1>
            <p className="text-sm text-pink-100/70">Resumen de tu aventura en Supabase</p>
          </div>
          <button
            onClick={() => fetchStats(trainer)}
            className="rounded-lg border border-pink-400/60 px-4 py-2 text-sm font-semibold text-pink-100 hover:-translate-y-0.5 transition"
          >
            {loading ? 'Actualizando...' : 'Refrescar'}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border-2 border-gray-600/80 rounded-2xl p-6 text-center bg-zinc-900 shadow-inner">
            <span className="text-6xl font-bold text-pink-500 block mb-2">{loading ? '—' : stats.captured}</span>
            <span className="text-xl">Capturados</span>
          </div>
          <div className="border-2 border-gray-600/80 rounded-2xl p-6 text-center bg-zinc-900 shadow-inner">
            <span className="text-6xl font-bold text-red-400 block mb-2">{loading ? '—' : stats.shinies}</span>
            <span className="text-xl">Shinies</span>
          </div>
          <div className="border-2 border-gray-600/80 rounded-2xl p-6 text-center bg-zinc-900 shadow-inner">
            <span className="text-6xl font-bold text-pink-300 block mb-2">{loading ? '—' : stats.categories}</span>
            <span className="text-xl">Tipos registrados</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <div className="border-2 border-green-600/80 rounded-3xl p-6 bg-[#0f1a13] shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-green-400">Buscador de Pokémon</h2>
              <button
                onClick={() => quickNavigate('/pokedex')}
                className="rounded-md border border-green-400/60 px-3 py-1 text-sm text-green-100 hover:-translate-y-0.5 transition"
              >
                Abrir Pokédex
              </button>
            </div>
            <p className="text-sm text-green-100/80 mb-4">Busca rápido un Pokémon por nombre o ID, mira su sprite y guárdalo en Supabase con tu entrenador activo.</p>

            <div className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchPokemon();
                }}
                className="flex gap-3"
              >
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ej. pikachu o 25"
                  className="flex-1 rounded-lg border border-green-500/40 bg-black/50 px-3 py-2 text-green-100 placeholder:text-green-200/60 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-60"
                >
                  {searching ? 'Buscando…' : 'Buscar'}
                </button>
              </form>

              {searchMessage && (
                <p className="text-sm text-green-200/80">{searchMessage}</p>
              )}

              {searchResult && (
                <div className="flex items-center gap-4 rounded-xl border border-green-500/50 bg-black/40 p-4">
                  <div className="h-20 w-20 overflow-hidden rounded-lg border border-green-400/60 bg-slate-900 grid place-items-center">
                    {searchResult.sprite ? (
                      <img src={searchResult.sprite} alt={searchResult.name} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-xs text-green-200">Sin imagen</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-green-200">{searchResult.name}</p>
                    <p className="text-sm text-green-100/70">{searchResult.type}</p>
                    {searchResult.isShiny && <p className="text-xs text-yellow-300 mt-1">✨ Shiny al azar</p>}
                  </div>
                  <button
                    onClick={handleCatch}
                    disabled={searching}
                    className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-60"
                  >
                    {searching ? 'Guardando…' : 'Atrapar'}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="border-2 border-blue-500/70 rounded-3xl p-6 bg-[#0f1625] shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-blue-300">Pokemap</h2>
              <button
                onClick={placeRandomPokemonMarkers}
                disabled={!mapReady || markersLoading}
                className="rounded-md border border-blue-300/50 px-3 py-1 text-sm text-blue-100 hover:-translate-y-0.5 transition disabled:opacity-50"
              >
                {markersLoading ? 'Actualizando…' : 'Nuevos marcadores'}
              </button>
            </div>
            <p className="text-sm text-blue-100/80 mb-4">Explora el mapa de Pokémon para ubicar tus capturas.</p>
           <div className="relative w-full h-[350px] min-h-[350px]">
           <div ref={mapContainerRef} className="w-full h-full" />
           </div>
            <div className="mt-3 text-sm text-blue-100/80">
              {statusText}
            </div>
          </div>
        </div>

        <footer className="mt-6 text-right">
          <p className="text-pink-400 italic">Desarrollado por Saul Ren</p>
        </footer>
      </main>
    </div>
  );
};

export default PokemonDashboard;