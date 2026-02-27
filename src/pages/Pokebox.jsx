import React from 'react'

const TYPE_STYLES = {
  fire: 'border-amber-500/70 bg-gradient-to-br from-amber-500/20 to-amber-700/15 text-amber-100',
  water: 'border-sky-500/70 bg-gradient-to-br from-sky-500/20 to-blue-700/15 text-sky-100',
  grass: 'border-emerald-500/70 bg-gradient-to-br from-emerald-500/20 to-emerald-700/15 text-emerald-100',
  electric: 'border-yellow-400/70 bg-gradient-to-br from-yellow-400/25 to-amber-500/20 text-amber-900',
  psychic: 'border-fuchsia-500/70 bg-gradient-to-br from-fuchsia-500/20 to-pink-700/20 text-fuchsia-100',
  ice: 'border-cyan-300/70 bg-gradient-to-br from-cyan-300/20 to-blue-500/15 text-cyan-50',
  dragon: 'border-indigo-500/70 bg-gradient-to-br from-indigo-500/20 to-purple-700/20 text-indigo-100',
  dark: 'border-slate-700/80 bg-gradient-to-br from-slate-800/70 to-black/50 text-slate-100',
  fairy: 'border-pink-300/70 bg-gradient-to-br from-pink-300/25 to-rose-400/20 text-rose-900',
  fighting: 'border-orange-600/70 bg-gradient-to-br from-orange-600/20 to-amber-700/20 text-orange-50',
  poison: 'border-purple-500/70 bg-gradient-to-br from-purple-500/20 to-purple-700/20 text-purple-100',
  ground: 'border-yellow-700/70 bg-gradient-to-br from-yellow-700/25 to-amber-800/25 text-amber-50',
  rock: 'border-amber-800/70 bg-gradient-to-br from-amber-800/25 to-stone-700/25 text-amber-50',
  bug: 'border-lime-600/70 bg-gradient-to-br from-lime-600/20 to-lime-800/20 text-lime-100',
  ghost: 'border-indigo-700/70 bg-gradient-to-br from-indigo-700/20 to-slate-900/30 text-indigo-100',
  steel: 'border-slate-400/70 bg-gradient-to-br from-slate-300/20 to-slate-500/20 text-slate-100',
  normal: 'border-slate-400/70 bg-gradient-to-br from-slate-300/20 to-slate-500/15 text-slate-100',
  flying: 'border-indigo-300/70 bg-gradient-to-br from-indigo-200/25 to-sky-400/20 text-indigo-900',
};

const badgeForRarity = (p) => {
  const rarity = (p.rarity || '').toLowerCase();
  if (p.is_shiny && rarity !== 'legendary' && rarity !== 'epic') {
    return <span className="rarity-shiny rounded-full border border-box-shiny/60 bg-box-shiny/20 px-2 py-1 text-[11px] font-bold text-box-shiny">Shiny</span>;
  }
  if (rarity === 'epic') {
    return <span className="rarity-legendary rarity-shiny rounded-full border border-box-legendary/60 bg-box-legendary/20 px-2 py-1 text-[11px] font-bold text-box-legendary">Legendario Shiny</span>;
  }
  if (rarity === 'legendary') {
    return <span className="rarity-legendary rounded-full border border-box-legendary/60 bg-box-legendary/15 px-2 py-1 text-[11px] font-bold text-box-legendary">Legendario</span>;
  }
  if (rarity === 'mythical') {
    return <span className="rarity-mythical rounded-full border border-box-mythical/60 bg-box-mythical/15 px-2 py-1 text-[11px] font-bold text-box-mythical">Mítico</span>;
  }
  return null;
};

const Pokebox = ({ pokemons = [], loading = false, trainer = 'Entrenador', onDelete, deletingId, onRename, renamingId }) => {
  const handleRenameClick = (pokemon) => {
    if (!onRename) return
    const nextName = window.prompt('Nuevo nombre / apodo', pokemon.name || '')
    if (!nextName || !nextName.trim()) return
    onRename(pokemon.id, nextName.trim())
  }

  const renderSkeleton = () => (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={`skeleton-${idx}`}
          className="h-64 rounded-2xl border border-box-slot-border bg-bg-card/60 shadow-[0_20px_40px_rgba(0,0,0,0.25)] animate-pulse"
        />
      ))}
    </div>
  )

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-box-slot-border bg-bg-card/60 px-6 py-10 text-center shadow-inner">
      <div className="h-14 w-14 rounded-full border border-dashed border-text-muted/40 bg-bg-panel/60 grid place-items-center text-2xl">📦</div>
      <p className="text-lg font-semibold text-text-main">No hay Pokémon en tu caja</p>
      <p className="text-sm text-text-muted">Captura algunos desde la Pokédex y regresan aquí</p>
    </div>
  )

  return (
    <div className="relative overflow-hidden rounded-3xl border border-box-border bg-bg-panel/70 p-5 shadow-neon backdrop-blur">
      <div className="absolute inset-0 bg-holo opacity-60" aria-hidden="true" />
      <div className="absolute inset-px rounded-[26px] border border-box-border/70" aria-hidden="true" />

      <header className="relative flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted">Pokebox</p>
          <h3 className="text-xl font-black text-text-main">Colección de {trainer}</h3>
          <p className="text-sm text-text-muted">{loading ? 'Actualizando caja...' : `${pokemons.length} Pokémon capturados`}</p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-accent-blue/40 bg-accent-blue/10 px-4 py-2 text-sm font-semibold text-accent-blue shadow-[0_0_16px_rgba(56,189,248,0.35)]">
          <span className="h-2 w-2 rounded-full bg-accent-blue animate-pulse" aria-hidden="true" />
          Caja conectada
        </div>
      </header>

      <div className="relative mt-6">
        {loading && renderSkeleton()}
        {!loading && pokemons.length === 0 && renderEmpty()}
        {!loading && pokemons.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {pokemons.map((p) => (
              <div
                key={p.id || p.name}
                className="group relative overflow-hidden rounded-2xl border border-box-slot-border bg-bg-card/80 p-4 shadow-[0_20px_48px_rgba(0,0,0,0.28)] backdrop-blur-sm"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-accent-blue/10 via-transparent to-accent-yellow/10" aria-hidden="true" />
                <div className="absolute inset-px rounded-2xl border border-box-slot-border/70" aria-hidden="true" />

                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-text-muted">
                    <span className="rounded-full bg-box-border px-2 py-1 text-[11px] uppercase tracking-wide text-text-main">#{p.id || '???'}</span>
                    {badgeForRarity(p)}
                  </div>
                  <span
                    className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${TYPE_STYLES[(p.type || '').split('/')[0]?.trim().toLowerCase()] || 'border-box-slot-border bg-bg-panel/70 text-text-muted'}`}
                  >
                    {p.type || 'Desconocido'}
                  </span>
                </div>

                <div className="relative mt-3 aspect-square overflow-hidden rounded-xl border border-box-slot-border bg-gradient-to-br from-bg-panel to-bg-main/80 shadow-inner">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.25),transparent_40%)]" aria-hidden="true" />
                  <div className="absolute inset-0" aria-hidden="true">
                    <div className="h-full w-full opacity-40 mix-blend-screen bg-[linear-gradient(135deg,rgba(56,189,248,0.15),rgba(250,204,21,0.12),rgba(168,85,247,0.15))]" />
                  </div>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name || 'Pokemon'}
                      className="relative z-10 h-full w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative z-10 grid h-full w-full place-items-center text-text-muted">Sin imagen</div>
                  )}
                </div>

                <div className="relative mt-3 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-black uppercase tracking-wide text-text-main">{p.name || 'SIN NOMBRE'}</p>
                    <p className="text-xs text-text-muted">{p.type || 'Tipo desconocido'}</p>
                  </div>
                  <div className="rounded-lg border border-box-slot-border bg-bg-panel/80 px-2 py-1 text-[11px] font-semibold text-text-muted shadow-inner">
                    Entrenador
                    <div className="text-text-main">{trainer}</div>
                  </div>
                </div>

                {(onRename || onDelete) && (
                  <div className="relative mt-4 grid grid-cols-2 gap-2">
                    {onRename && (
                      <button
                        type="button"
                        className="rounded-xl border border-accent-yellow/60 bg-accent-yellow/80 px-3 py-2 text-xs font-black uppercase tracking-wide text-bg-main shadow-[0_6px_0_rgba(202,138,4,0.7)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
                        onClick={() => handleRenameClick(p)}
                        disabled={renamingId === p.id}
                      >
                        {renamingId === p.id ? 'Renombrando...' : 'Renombrar'}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        className="rounded-xl border border-accent-red/70 bg-accent-red/90 px-3 py-2 text-xs font-black uppercase tracking-wide text-white shadow-[0_6px_0_rgba(185,28,28,0.7)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
                        onClick={() => onDelete(p.id)}
                        disabled={deletingId === p.id}
                      >
                        {deletingId === p.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Pokebox
