import React from 'react';
import { Link } from 'react-router-dom';

const PokedexControls = ({
  powerOn,
  togglePower,
  onNext,
  onPrev,
  onSearch,
  searchQuery,
  setSearchQuery,
  status,
  onRandom,
  onCatch,
  catchCooldown,
  onToggleBox,
  boxOpen,
  trainerName,
  useRetroSprites,
  onToggleRetro,
}) => {
  const statusText = status === 'IDLE' ? 'EN ESPERA' :
    status === 'LOADING' ? 'ESCANEANDO...' :
    status === 'ERROR' ? 'ERROR DE DATOS' :
    status === 'CAUGHT' ? '¡REGISTRADO EN BD!' :
    status === 'ESCAPED' ? '¡SE ESCAPÓ!' :
    'LISTO';

  const statusColor = status === 'ERROR' || status === 'ESCAPED'
    ? 'text-red-300'
    : status === 'LOADING'
      ? 'text-amber-200'
      : 'text-emerald-200';

  return (
    <div className="rounded-2xl border-4 border-[#4f4a66] bg-[#c4cfa1] shadow-[0_18px_45px_rgba(0,0,0,0.4)] p-5">
      <div className="flex items-center justify-between text-[11px] font-black tracking-[0.15em] text-[#0f380f] mb-3 uppercase">
        <span>Entrenador: {trainerName}</span>
        <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" /> PWR</span>
      </div>

      <div className="rounded-xl border-2 border-[#4f4a66] bg-[#777c86] p-4 shadow-[inset_0_6px_12px_rgba(0,0,0,0.28)] space-y-4">
        <button
          onClick={togglePower}
          className={`w-full rounded-xl px-4 py-3 text-sm font-black uppercase tracking-widest border transition ${powerOn ? 'bg-emerald-500 text-[#0f380f] border-emerald-700 shadow-[0_6px_0_#064e3b]' : 'bg-slate-800 text-slate-100 border-slate-900 shadow-[0_6px_0_#0f172a]'}`}
        >
          {powerOn ? 'Sistema encendido' : 'Sistema apagado'}
        </button>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.22em] text-slate-200">Sistema de búsqueda</label>
          <form onSubmit={(e) => { e.preventDefault(); onSearch(searchQuery); }} className="flex gap-2">
            <input
              type="text"
              placeholder="Nombre o ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={!powerOn}
              className="flex-1 rounded-lg border-2 border-[#4f4a66] bg-slate-950 px-3 py-2 text-slate-100 uppercase placeholder:text-slate-500 shadow-[inset_0_3px_6px_rgba(0,0,0,0.35)] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!powerOn || status === 'LOADING'}
              className="rounded-lg bg-amber-400 text-[#0f380f] font-extrabold px-4 py-2 border border-amber-600 shadow-[0_4px_0_#92400e] disabled:opacity-60"
            >
              IR
            </button>
          </form>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={onPrev}
            disabled={!powerOn}
            className="flex-1 rounded-lg bg-slate-900 text-slate-100 font-bold py-2 border border-slate-800 shadow-[0_4px_0_#0f172a] disabled:opacity-60"
          >
            ◀ ANT
          </button>
          <button
            onClick={onNext}
            disabled={!powerOn}
            className="flex-1 rounded-lg bg-slate-900 text-slate-100 font-bold py-2 border border-slate-800 shadow-[0_4px_0_#0f172a] disabled:opacity-60"
          >
            SIG ▶
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onCatch}
            disabled={!powerOn || status === 'LOADING' || status === 'CAUGHT' || catchCooldown}
            className="rounded-lg bg-emerald-500 text-[#0f380f] font-black py-3 border border-emerald-700 shadow-[0_5px_0_#064e3b] disabled:opacity-60"
          >
            {catchCooldown ? 'ESPERA...' : status === 'CAUGHT' ? '¡CAPTURADO!' : 'ATRAPAR'}
          </button>
          <button
            onClick={onRandom}
            disabled={!powerOn}
            className="rounded-lg bg-indigo-500 text-white font-black py-3 border border-indigo-700 shadow-[0_5px_0_#312e81] disabled:opacity-60"
          >
            ALEATORIO 🔀
          </button>
        </div>

        <div className="rounded-lg border-2 border-[#4f4a66] bg-slate-950/80 px-3 py-2 shadow-[inset_0_4px_8px_rgba(0,0,0,0.35)] text-[11px] text-slate-100 flex items-center justify-between">
          <div className="uppercase tracking-[0.2em] font-black text-slate-200">Sprites</div>
          <button
            type="button"
            onClick={onToggleRetro}
            disabled={!powerOn}
            aria-pressed={useRetroSprites}
            className={`relative inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black transition ${useRetroSprites ? 'bg-emerald-400 text-[#0f380f] border-emerald-600 shadow-[0_3px_0_#065f46]' : 'bg-slate-800 text-slate-100 border-slate-700 shadow-[0_3px_0_#0f172a]'} disabled:opacity-60`}
          >
            <span className="h-4 w-7 rounded-full border border-slate-700 bg-slate-900 shadow-inner flex items-center px-0.5">
              <span className={`h-3 w-3 rounded-full transition ${useRetroSprites ? 'translate-x-3 bg-emerald-300' : 'translate-x-0 bg-slate-400'}`} />
            </span>
            {useRetroSprites ? 'Modo retro' : 'Arte oficial'}
          </button>
        </div>

        <div className="space-y-2">
          <Link to="/pokebox" className="block">
            <button className="w-full rounded-lg bg-amber-400 text-[#0f380f] font-black py-3 border border-amber-700 shadow-[0_5px_0_#92400e]">
              Ir a Pokebox ➜
            </button>
          </Link>
          <Link to="/dashboard" className="block">
            <button className="w-full rounded-lg bg-slate-900 text-white font-bold py-3 border border-slate-800 shadow-[0_5px_0_#0f172a]">
              Volver al Dashboard
            </button>
          </Link>
        </div>

        <div className={`rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-center text-[11px] font-mono tracking-wide ${statusColor}`}>
          ESTADO: {statusText}
        </div>
      </div>
    </div>
  );
};

export default PokedexControls;