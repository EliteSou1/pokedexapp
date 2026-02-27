import React from 'react';

const PokedexScreen = ({ pokemon, loading, error, powerOn, rarityEvent, boxOpen, boxLoading, boxPokemons, trainer, level, onPlayCry }) => {
  if (!powerOn) {
    return (
      <div className="rounded-[22px] border-4 border-[#4f4a66] bg-[#777c86] shadow-[inset_0_6px_12px_rgba(0,0,0,0.35),0_12px_30px_rgba(0,0,0,0.4)] p-5 text-center text-slate-200 uppercase tracking-wide">
        POWER OFF
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-[22px] border-4 border-[#4f4a66] bg-[#777c86] shadow-[inset_0_6px_12px_rgba(0,0,0,0.35),0_12px_30px_rgba(0,0,0,0.4)] p-5 text-center text-slate-200 uppercase tracking-wide">
        CARGANDO DATOS...
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="rounded-[22px] border-4 border-red-700 bg-red-900/40 shadow-[inset_0_6px_12px_rgba(0,0,0,0.35),0_12px_30px_rgba(0,0,0,0.4)] p-5 text-center text-red-100 uppercase tracking-wide">
        ERROR · NO SE ENCONTRARON DATOS
      </div>
    );
  }

  const formatID = (id) => `#${String(id).padStart(3, '0')}`;
  const detectedLevel = level ?? (pokemon ? pokemon.level : null);
  const isLegendary = pokemon?.isLegendary;
  const badgeText = isLegendary && pokemon.isShiny
    ? 'Legendario Shiny'
    : isLegendary
      ? 'Legendario'
      : pokemon.isShiny
        ? 'Shiny'
        : null;
  const badgeColor = isLegendary && pokemon.isShiny
    ? 'from-orange-400 to-amber-200 text-slate-900'
    : isLegendary
      ? 'from-blue-500 to-cyan-300 text-white'
      : pokemon.isShiny
        ? 'from-amber-400 to-yellow-300 text-slate-900'
        : '';

  return (
    <div className="space-y-4">
      {rarityEvent && (
        <div className="rounded-xl border border-indigo-500/50 bg-indigo-900/40 px-4 py-3 text-indigo-100 shadow">
          {rarityEvent.type === 'epic' ? '¡LEGENDARIO SHINY!' : rarityEvent.type === 'legendary' ? '¡LEGENDARIO!' : '¡SHINY!'}
        </div>
      )}

      <div className="rounded-[22px] border-4 border-[#4f4a66] bg-[#777c86] shadow-[inset_0_8px_14px_rgba(0,0,0,0.35),0_14px_36px_rgba(0,0,0,0.45)] p-5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-70 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(0,0,0,0.12),transparent_38%)]" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="text-xs font-semibold text-slate-200 tracking-[0.15em]">{formatID(pokemon.id)}</div>
          <div className="flex items-center gap-2">
            {badgeText && (
              <span className={`rounded-full px-3 py-1 text-[11px] font-black bg-gradient-to-r ${badgeColor}`}>
                {badgeText}
              </span>
            )}
            {detectedLevel !== null && (
              <span className="rounded-full bg-emerald-500/25 text-emerald-100 border border-emerald-600/70 px-3 py-1 text-[11px] font-black">
                NIVEL {detectedLevel}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-xl border-4 border-[#444] bg-[#9bbc0f] shadow-[inset_0_8px_14px_rgba(0,0,0,0.3)] p-4 flex flex-col items-center gap-3 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-25 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.08),rgba(0,0,0,0.08)_1px,transparent_1px,transparent_3px)]" />
          <img src={pokemon.sprite} alt={pokemon.name} className="w-48 h-48 object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)] saturate-150 contrast-125" />
          <h2 className="text-xl font-black tracking-[0.15em] text-[#0f380f] uppercase z-10">{pokemon.name}</h2>
          {pokemon.cryList && pokemon.cryList.length > 0 && (
            <button
              onClick={onPlayCry}
              className="z-10 rounded-md border-2 border-[#0f380f] bg-[#8bac0f] px-3 py-2 text-[11px] font-black text-[#0f380f] shadow-[0_4px_0_#4f6d0f]"
            >
              Reproducir grito
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 relative z-10">
          <div className="space-y-2 text-sm text-slate-200">
            <p className="font-semibold tracking-wide">TIPO: <span className="font-black text-white">{pokemon.types.join(' / ')}</span></p>
            <div className="flex items-center gap-4">
              <span>ALT: <strong className="text-white">{pokemon.height}m</strong></span>
              <span>PESO: <strong className="text-white">{pokemon.weight}kg</strong></span>
            </div>
            <p>HABILIDAD: <span className="font-black text-white">{pokemon.abilities[0]}</span></p>
          </div>
          <div className="text-sm text-slate-100 leading-relaxed bg-slate-900/60 border border-slate-800 rounded-xl p-3 shadow-inner">
            {pokemon.description}
          </div>
        </div>

        <div className="mt-5 grid gap-3 relative z-10">
          {pokemon.stats.map((stat) => (
            <div key={stat.name} className="flex items-center gap-3">
              <span className="w-28 text-[10px] font-black text-slate-200 uppercase tracking-[0.2em]">{stat.name}</span>
              <div className="flex-1 h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.min(stat.value, 180) / 1.8}%` }} />
              </div>
              <span className="w-10 text-right text-sm font-black text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {boxOpen && (
        <div className="rounded-2xl border-2 border-[#4f4a66] bg-slate-900/70 p-4 shadow-inner">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-100 mb-3">
            <span>CAJA · {trainer}</span>
            {boxLoading && <span className="text-amber-300">CARGANDO...</span>}
          </div>
          {!boxLoading && boxPokemons && boxPokemons.length === 0 && (
            <div className="text-center text-slate-400 text-sm">SIN POKÉMON</div>
          )}
          {!boxLoading && boxPokemons && boxPokemons.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {boxPokemons.slice(0, 6).map((p) => (
                <div key={`${p.id}-${p.name}`} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/60 px-3 py-2">
                  <span className="font-bold text-slate-100">{p.name}</span>
                  <span className="text-slate-300">{p.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PokedexScreen;
