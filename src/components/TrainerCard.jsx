import React from 'react'

const TrainerCard = ({
  name = 'Entrenador',
  subtitle = 'Licencia de Entrenador',
  caught = 0,
  shinies = 0,
  status = 'En línea'
}) => {
  const initials = name.trim().slice(0, 2).toUpperCase() || 'TR'

  return (
    <div className="relative overflow-hidden rounded-2xl border border-trainer-border/70 bg-trainer-bg/80 p-4 shadow-neon backdrop-blur">
      <div className="absolute inset-0 bg-holo opacity-70" aria-hidden="true" />
      <div className="absolute inset-px rounded-2xl border border-trainer-border/50" aria-hidden="true" />

      <div className="relative flex items-center gap-4">
        <div className="relative grid h-14 w-14 place-items-center rounded-xl border-2 border-trainer-avatar-border bg-gradient-to-br from-bg-panel to-bg-main text-lg font-black text-trainer-name shadow-neon">
          <span>{initials}</span>
          <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-white/10 animate-crt-flicker" aria-hidden="true" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted">Trainer Card</p>
          <p className="text-xl font-black text-trainer-name">{name}</p>
          <p className="text-xs text-text-muted">{subtitle}</p>
        </div>
      </div>

      <div className="relative mt-4 grid grid-cols-3 gap-3 text-center text-xs text-text-muted">
        <div className="rounded-xl border border-trainer-border/50 bg-bg-panel/80 px-3 py-3 shadow-inner">
          <div className="text-2xl font-black text-accent-blue">{caught}</div>
          <div className="uppercase tracking-[0.2em]">Capturas</div>
        </div>
        <div className="rounded-xl border border-trainer-border/50 bg-bg-panel/80 px-3 py-3 shadow-inner">
          <div className="text-2xl font-black text-accent-yellow">{shinies}</div>
          <div className="uppercase tracking-[0.2em]">Shiny</div>
        </div>
        <div className="rounded-xl border border-trainer-border/50 bg-bg-panel/80 px-3 py-3 shadow-inner">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-text-main">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-blue shadow-neon" aria-hidden="true" />
            <span>{status}</span>
          </div>
          <div className="uppercase tracking-[0.2em]">Estado</div>
        </div>
      </div>
    </div>
  )
}

export default TrainerCard
