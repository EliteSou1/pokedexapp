import React, { useState, useEffect, useRef } from 'react';
import PokedexScreen from './PokedexScreen';
import PokedexControls from './PokedexControls';
import Pokebox from './Pokebox';
import { supabase } from './client.js';

// Diccionario simple 
const TYPE_TRANSLATIONS = {
  normal: 'Normal', fighting: 'Lucha', flying: 'Volador', poison: 'Veneno',
  ground: 'Tierra', rock: 'Roca', bug: 'Bicho', ghost: 'Fantasma',
  steel: 'Acero', fire: 'Fuego', water: 'Agua', grass: 'Planta',
  electric: 'Eléctrico', psychic: 'Psíquico', ice: 'Hielo', dragon: 'Dragón',
  dark: 'Siniestro', fairy: 'Hada'
};

const STAT_TRANSLATIONS = {
  hp: 'PS',
  attack: 'ATAQUE',
  defense: 'DEFENSA',
  'special-attack': 'AT. ESP',
  'special-defense': 'DEF. ESP',
  speed: 'VELOCIDAD'
};

const MAX_POKEDEX_ID = 20000; // Permitir cualquier entrada/forma expuesta por la API
const LEGENDARY_CHANCE = 0.005; // 5% chance de forzar legendario/mitico en aleatorio


const Pokedex = () => {
  const [powerOn, setPowerOn] = useState(false);
  const [status, setStatus] = useState('IDLE'); 
  const [pokemonId, setPokemonId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const audioRef = useRef(null);
  const [useRetroSprites, setUseRetroSprites] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('pokedex_retro_mode');
    return stored === null ? true : stored === '1';
  });
  
  // Nuevo Estado: Nivel aleatorio
  const [currentLevel, setCurrentLevel] = useState(5); 
  const [catchCooldown, setCatchCooldown] = useState(false);
  const [boxOpen, setBoxOpen] = useState(false);
  const [boxLoading, setBoxLoading] = useState(false);
  const [boxPokemons, setBoxPokemons] = useState([]);
  const [rarityEvent, setRarityEvent] = useState(null);
  const [trainerName, setTrainerName] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('trainer_current') : null;
    return stored && stored.trim().length > 0 ? stored : 'Ash Ketchum';
  });

  const getRandomId = () => Math.floor(Math.random() * MAX_POKEDEX_ID) + 1;

  const getRandomCatalogEntry = () => {
    if (!catalog || catalog.length === 0) return null;
    return catalog[Math.floor(Math.random() * catalog.length)]?.name;
  };

  const getRandomLegendaryId = async () => {
    for (let i = 0; i < 25; i += 1) {
      const candidate = getRandomId();
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${candidate}`);
        if (!res.ok) continue;
        const species = await res.json();
        if (species.is_legendary || species.is_mythical) return candidate;
      } catch (e) {
        console.warn('Intento legendario fallido', e);
      }
    }
    return getRandomId();
  };

  // --- OBTENER POKEMON ---
  const fetchPokemon = async (query) => {
    if (!query) return;
    try {
      setStatus('LOADING');
      setRarityEvent(null);

      const target = query.toString().trim();
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${target}`);
      if (!res.ok) throw new Error('No se pudo cargar el Pokémon');
      const data = await res.json();

      const speciesRes = await fetch(data.species.url);
      const species = await speciesRes.json();

      const flavorEs = species.flavor_text_entries.find((entry) => entry.language.name === 'es');
      const flavorEn = species.flavor_text_entries.find((entry) => entry.language.name === 'en');
      const description = (flavorEs?.flavor_text || flavorEn?.flavor_text || 'SIN DESCRIPCIÓN')
        .replace(/[\n\f]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const cryList = [];
      if (data.cries?.latest) cryList.push(data.cries.latest);
      if (data.cries?.legacy) cryList.push(data.cries.legacy);

      const isLegendary = species.is_legendary || species.is_mythical;
      const isShiny = Math.random() < 0.1;

      const officialDefault = data.sprites?.other?.['official-artwork']?.front_default || data.sprites.front_default;
      const officialShiny = data.sprites?.other?.['official-artwork']?.front_shiny || data.sprites.front_shiny;
      const retroDefault = data.sprites?.versions?.['generation-v']?.['black-white']?.front_default || data.sprites.front_default;
      const retroShiny = data.sprites?.versions?.['generation-v']?.['black-white']?.front_shiny || data.sprites.front_shiny;

      const spriteRetro = isShiny ? (retroShiny || retroDefault || officialShiny || officialDefault) : (retroDefault || officialDefault);
      const spriteOfficial = isShiny ? (officialShiny || officialDefault || retroShiny || retroDefault) : (officialDefault || retroDefault);
      const artwork = useRetroSprites ? spriteRetro : spriteOfficial;

      const level = Math.max(1, Math.floor(Math.random() * 100) + 1);
      setCurrentLevel(level);

      const rawName = data.name || '';
      const formattedName = rawName.replace(/-/g, ' ').toUpperCase();
      const formLabel = (() => {
        if (rawName.includes('alola')) return 'Forma Alola';
        if (rawName.includes('galar')) return 'Forma Galar';
        if (rawName.includes('hisui')) return 'Forma Hisui';
        if (rawName.includes('paldea')) return 'Forma Paldea';
        if (rawName.includes('mega-x')) return 'Mega X';
        if (rawName.includes('mega-y')) return 'Mega Y';
        if (rawName.includes('mega')) return 'Mega';
        return null;
      })();

      const formatted = {
        id: data.id,
        name: formattedName,
        types: data.types.map((t) => TYPE_TRANSLATIONS[t.type.name] || t.type.name.toUpperCase()),
        rawType: data.types.map((t) => t.type.name).join(' / '),
        height: (data.height / 10).toFixed(1),
        weight: (data.weight / 10).toFixed(1),
        image: artwork || spriteRetro || spriteOfficial,
        sprite: artwork || spriteRetro || spriteOfficial,
        artwork: artwork || spriteRetro || spriteOfficial,
        spriteRetro,
        spriteOfficial,
        description,
        abilities: data.abilities.map((a) => a.ability.name.toUpperCase()),
        cryList,
        stats: data.stats.map((s) => ({
          name: STAT_TRANSLATIONS[s.stat.name] || s.stat.name.toUpperCase(),
          value: s.base_stat
        })),
        isLegendary,
        isShiny,
        level,
        rarity: isLegendary && isShiny ? 'epic' : isLegendary ? 'legendary' : isShiny ? 'shiny' : 'normal',
        form: formLabel,
      };

      setPokemonData(formatted);
      setPokemonId(data.id);

      const eventType = isLegendary && isShiny ? 'epic' : isLegendary ? 'legendary' : isShiny ? 'shiny' : null;
      setRarityEvent(eventType ? { type: eventType, pokemon: formatted } : null);
      if (eventType) {
        setTimeout(() => setRarityEvent(null), 3200);
      }

      setStatus('READY');
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
    }
  };

  // --- LÓGICA DE CAPTURA (SUPABASE) ---
  const handleCatch = async () => {
    if (!pokemonData) return;

    setStatus('LOADING');

    // 1. Calcular Probabilidad basada en Nivel
    // Fórmula: Entre más alto el nivel, menor la probabilidad.
    // Nivel 100 = 20% chance. Nivel 1 = 99% chance.
    const catchChance = Math.max(20, 100 - (currentLevel * 0.8));
    const roll = Math.random() * 100;

   console.log(`Id: ${pokemonData.id}, Nombre: ${pokemonData.name}, Nivel: ${currentLevel}, Probabilidad: ${catchChance}%, Dado: ${roll.toFixed(2)}, ${roll > catchChance ? 'Falló' : 'Capturado'}`);


    if (roll > catchChance) {
      // Falló la captura
      setStatus('ESCAPED');
      setCatchCooldown(true);
      setTimeout(() => {
        setStatus('READY');
        setCatchCooldown(false);
      }, 1000); // Cooldown de 1s para reintentar
      handleRandom();
      return;
    }

    // 2. Éxito: Guardar en Supabase
    try {
      const chosenSprite = useRetroSprites
        ? (pokemonData?.spriteRetro || pokemonData?.sprite || pokemonData?.image)
        : (pokemonData?.spriteOfficial || pokemonData?.sprite || pokemonData?.image);

      const payload = {
        name: pokemonData.name,
        type: pokemonData.rawType,
        image: chosenSprite,
        trainer: trainerName,
        rarity: pokemonData.rarity || (pokemonData.isLegendary && pokemonData.isShiny ? 'epic' : pokemonData.isLegendary ? 'legendary' : pokemonData.isShiny ? 'shiny' : 'normal'),
        is_shiny: !!pokemonData.isShiny,
        level: pokemonData.level ?? currentLevel,
      };

      let { error } = await supabase
        .from('pokemons')
        .insert([payload]);

      

      if (error) throw error;

      setStatus('CAUGHT');
      // Al atrapar, cargar inmediatamente un Pokémon aleatorio
      handleRandom();
      
    } catch (error) {
      console.error('Error guardando en Supabase:', error);
      setStatus('ERROR');
    }
  };

  // --- EFECTOS Y HANDLERS ---
  useEffect(() => {
    if (powerOn && !pokemonData) fetchPokemon(1);
    else if (!powerOn) { setPokemonData(null); setStatus('IDLE'); }
  }, [powerOn]);

  useEffect(() => {
    if (!powerOn || catalog.length > 0) return;
    (async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
        if (!res.ok) throw new Error('No se pudo cargar el catálogo completo');
        const data = await res.json();
        setCatalog(data.results || []);
      } catch (err) {
        console.warn('Catálogo PokeAPI incompleto:', err?.message || err);
      }
    })();
  }, [powerOn, catalog.length]);

  useEffect(() => {
    if (!powerOn) return;
    const cries = pokemonData?.cryList;
    if (!cries || cries.length === 0) return;
    const cry = cries[Math.floor(Math.random() * cries.length)];
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(cry);
      audioRef.current = audio;
      audio.play().catch((err) => console.warn('No se pudo reproducir el grito:', err?.message || err));
    } catch (err) {
      console.warn('Audio error:', err?.message || err);
    }
  }, [pokemonData, powerOn]);

  const playCry = () => {
    if (!powerOn) return;
    const cries = pokemonData?.cryList;
    if (!cries || cries.length === 0) return;
    const cry = cries[Math.floor(Math.random() * cries.length)];
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(cry);
      audioRef.current = audio;
      audio.play().catch((err) => console.warn('No se pudo reproducir el grito:', err?.message || err));
    } catch (err) {
      console.warn('Audio error:', err?.message || err);
    }
  };

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('trainer_current') : null;
    if (stored && stored.trim().length > 0 && stored !== trainerName) {
      setTrainerName(stored);
    }
  }, []);

  const handleNext = () => fetchPokemon(pokemonId + 1);
  const handlePrev = () => fetchPokemon(pokemonId > 1 ? pokemonId - 1 : 1);
  
  const handleSearch = (q) => {
    if(!q) return;
    fetchPokemon(q.toLowerCase());
    setSearchQuery('');
  };

  const handleRandom = async () => {
    const wantsLegendary = Math.random() < LEGENDARY_CHANCE;
    if (wantsLegendary) {
      const targetId = await getRandomLegendaryId();
      fetchPokemon(targetId);
      return;
    }

    const entry = getRandomCatalogEntry();
    if (entry) {
      fetchPokemon(entry);
    } else {
      fetchPokemon(getRandomId());
    }
  };

  const fetchBox = async () => {
    try {
      setBoxLoading(true);
      let { data, error } = await supabase
        .from('pokemons')
        .select('id,name,type,image,is_shiny,rarity')
        .eq('trainer', trainerName)
        .order('id', { ascending: false });

      // Fallback si la columna is_shiny no existe
      if (error) {
        console.warn('Reintentando fetch de caja sin is_shiny:', error.message);
        ({ data, error } = await supabase
          .from('pokemons')
          .select('id,name,type,image,rarity')
          .eq('trainer', trainerName)
          .order('id', { ascending: false }));
      }

      if (error) throw error;
      const mapped = (data || []).map((p) => ({
        ...p,
        is_shiny: p.is_shiny ?? false,
        rarity: p.rarity || 'normal',
      }));
      setBoxPokemons(mapped);
    } catch (err) {
      console.error('Error cargando caja:', err);
      setBoxPokemons([]);
    } finally {
      setBoxLoading(false);
    }
  };

  const handleToggleBox = () => {
    if (!powerOn) return;
    const next = !boxOpen;
    setBoxOpen(next);
    if (next) fetchBox();
  };

  const handleTrainerChange = (value) => {
    setTrainerName(value);
    if (boxOpen) fetchBox();
  };

  const toggleRetro = () => {
    setUseRetroSprites((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('pokedex_retro_mode', next ? '1' : '0');
      }
      return next;
    });
  };

  const displaySprite = pokemonData
    ? (useRetroSprites
      ? (pokemonData.spriteRetro || pokemonData.sprite || pokemonData.image)
      : (pokemonData.spriteOfficial || pokemonData.sprite || pokemonData.image))
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8 md:py-12 flex items-center justify-center">
      <div className="relative w-full max-w-6xl rounded-[28px] border-4 border-[#8b956d] bg-[#c4cfa1] shadow-[0_20px_60px_rgba(0,0,0,0.45)] px-4 py-6 md:px-8 md:py-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(0,0,0,0.06),transparent_30%)]" />

        <div className="relative flex flex-col gap-6 md:gap-8 md:flex-row">
          <div className="flex-1">
            <PokedexScreen
              pokemon={pokemonData ? { ...pokemonData, image: displaySprite, sprite: displaySprite, artwork: displaySprite, abilities: pokemonData.abilities || [], level: pokemonData.level ?? currentLevel } : null}
              loading={status === 'LOADING'}
              error={status === 'ERROR'}
              powerOn={powerOn}
              rarityEvent={rarityEvent}
              boxOpen={boxOpen}
              boxLoading={boxLoading}
              boxPokemons={boxPokemons}
              trainer={trainerName}
              level={pokemonData?.level ?? currentLevel}
              onPlayCry={playCry}
            />
          </div>

          <div className="w-full md:w-[380px]">
            <PokedexControls
              powerOn={powerOn}
              togglePower={() => setPowerOn(!powerOn)}
              onNext={handleNext}
              onPrev={handlePrev}
              onSearch={handleSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              status={status}
              onRandom={handleRandom}
              onCatch={handleCatch}
              catchCooldown={catchCooldown}
              onToggleBox={handleToggleBox}
              boxOpen={boxOpen}
              boxLoading={boxLoading}
              trainerName={trainerName}
              onTrainerChange={handleTrainerChange}
              useRetroSprites={useRetroSprites}
              onToggleRetro={toggleRetro}
            />
          </div>
        </div>

        {boxOpen && (
          <div className="relative mt-6 rounded-2xl border-2 border-[#4f4a66] bg-slate-900/60 p-4 shadow-inner">
            <Pokebox pokemons={boxPokemons} loading={boxLoading} trainer={trainerName} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Pokedex;