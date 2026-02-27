import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const avatars = [
  'https://play.pokemonshowdown.com/sprites/trainers/red.png',
  'https://play.pokemonshowdown.com/sprites/trainers/leaf.png',
  'https://play.pokemonshowdown.com/sprites/trainers/ethan.png',
  'https://play.pokemonshowdown.com/sprites/trainers/lyra.png',
  'https://play.pokemonshowdown.com/sprites/trainers/brendan.png',
  'https://play.pokemonshowdown.com/sprites/trainers/may.png',
  'https://play.pokemonshowdown.com/sprites/trainers/lucas.png',
  'https://play.pokemonshowdown.com/sprites/trainers/dawn.png'
]

function Login() {
  const [user, setUser] = useState('')
  const [isPressed, setIsPressed] = useState(false)
  const [avatarIndex, setAvatarIndex] = useState(() => {
    const storedIdx = localStorage.getItem('trainer_avatar_idx')
    const idx = storedIdx ? parseInt(storedIdx, 10) : 0
    return Number.isNaN(idx) ? 0 : Math.min(Math.max(idx, 0), avatars.length - 1)
  })
  const [trainerId] = useState(() => Math.floor(Math.random() * 99999).toString().padStart(5, '0'))

  const navigate = useNavigate()

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('trainer_current')
    if (stored && stored.trim().length > 0) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleLogin = (e) => {
    e.preventDefault()
    if (user.trim().length > 2) {
      localStorage.setItem('trainer_current', user.trim())
      localStorage.setItem('trainer_avatar', avatars[avatarIndex])
      localStorage.setItem('trainer_avatar_idx', String(avatarIndex))
      navigate('/dashboard')
    } else {
      const inputElement = document.getElementById('name-input')
      inputElement?.classList.add('animate-pulse', 'border-red-500', 'bg-red-100')
      setTimeout(() => {
        inputElement?.classList.remove('animate-pulse', 'border-red-500', 'bg-red-100')
      }, 500)
    }
  }

  const handlePrevAvatar = () => setAvatarIndex((i) => (i - 1 + avatars.length) % avatars.length)
  const handleNextAvatar = () => setAvatarIndex((i) => (i + 1) % avatars.length)

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-bg-main via-bg-panel to-[#0b1020] p-4 font-['Press_Start_2P'] text-text-main antialiased">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.16),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(250,204,21,0.12),transparent_30%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-holo opacity-30" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:22px_22px] opacity-20" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-[28px] border border-box-border bg-bg-panel/80 p-6 shadow-neon backdrop-blur">
          <div className="pointer-events-none absolute inset-0 bg-holo opacity-60" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-px rounded-[24px] border border-box-border/60" aria-hidden="true" />

          <div className="relative mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted">Acceso entrenador</p>
              <h1 className="text-2xl font-black text-white drop-shadow">Pokedex Login</h1>
              <p className="text-xs text-text-muted">Sincroniza tu perfil para guardar tus capturas</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-accent-blue/50 bg-accent-blue/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-accent-blue shadow-[0_0_16px_rgba(56,189,248,0.35)]">
              <span className="h-2 w-2 rounded-full bg-accent-blue animate-pulse" aria-hidden="true" />
              Online
            </div>
          </div>

          <div className="relative grid gap-6 md:grid-cols-[1.2fr,1fr]">
            <div className="relative overflow-hidden rounded-2xl border border-box-slot-border bg-bg-card/80 p-5 shadow-inner">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.18),transparent_35%)] opacity-70" aria-hidden="true" />
              <div className="pointer-events-none absolute inset-px rounded-2xl border border-box-slot-border/60" aria-hidden="true" />

              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-accent-red shadow-neon-red" />
                    <span className="h-3 w-3 rounded-full bg-accent-yellow shadow-neon-gold" />
                    <span className="h-3 w-3 rounded-full bg-accent-blue shadow-neon" />
                  </div>
                  <span className="rounded-full border border-accent-yellow/50 bg-accent-yellow/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-accent-yellow">Ver. 1.0</span>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr,1.2fr]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative grid h-36 w-36 place-items-center overflow-hidden rounded-2xl border border-box-slot-border bg-bg-panel/80 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.2),rgba(250,204,21,0.16),rgba(168,85,247,0.18))] opacity-40" aria-hidden="true" />
                      <img
                        src={avatars[avatarIndex]}
                        alt="Trainer"
                        className="relative z-10 h-28 w-28 object-contain"
                      />
                    </div>
                    <div className="flex w-full items-center justify-between gap-2">
                      <button
                        onClick={handlePrevAvatar}
                        type="button"
                        className="group flex h-11 w-11 items-center justify-center rounded-xl border border-accent-blue/60 bg-accent-blue/90 text-bg-main shadow-[0_6px_0_rgba(14,165,233,0.7)] transition hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span className="translate-y-0.5 text-lg">◀</span>
                      </button>
                      <div className="flex-1 rounded-xl border border-box-slot-border bg-bg-panel/80 px-3 py-2 text-center text-[11px] font-semibold text-text-muted">{avatarIndex + 1} / {avatars.length}</div>
                      <button
                        onClick={handleNextAvatar}
                        type="button"
                        className="group flex h-11 w-11 items-center justify-center rounded-xl border border-accent-yellow/70 bg-accent-yellow/90 text-bg-main shadow-[0_6px_0_rgba(202,138,4,0.7)] transition hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span className="translate-y-0.5 text-lg">▶</span>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Tu nombre</label>
                      <input
                        id="name-input"
                        type="text"
                        placeholder="ASH..."
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        className="w-full rounded-xl border border-box-slot-border bg-bg-panel/80 px-3 py-3 text-sm text-text-main placeholder:text-text-muted shadow-inner focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
                        autoComplete="off"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-[10px] text-text-muted">
                      <div className="rounded-xl border border-box-slot-border bg-bg-panel/70 px-3 py-2 shadow-inner">
                        <p className="uppercase tracking-[0.15em]">Región</p>
                        <p className="text-sm font-black text-text-main">Kanto</p>
                      </div>
                      <div className="rounded-xl border border-box-slot-border bg-bg-panel/70 px-3 py-2 shadow-inner">
                        <p className="uppercase tracking-[0.15em]">ID</p>
                        <p className="text-sm font-black text-accent-blue">{trainerId}</p>
                      </div>
                      <div className="rounded-xl border border-box-slot-border bg-bg-panel/70 px-3 py-2 shadow-inner">
                        <p className="uppercase tracking-[0.15em]">Estado</p>
                        <p className="text-sm font-black text-accent-yellow">Rookie</p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      onMouseDown={() => setIsPressed(true)}
                      onMouseUp={() => setIsPressed(false)}
                      onMouseLeave={() => setIsPressed(false)}
                      className={`
                        relative mt-2 w-full overflow-hidden rounded-xl border border-accent-red/70 bg-accent-red/90 px-4 py-4 text-xs font-black uppercase tracking-[0.3em] text-white shadow-[0_10px_0_rgba(185,28,28,0.7)] transition duration-75
                        ${isPressed ? 'translate-y-1 shadow-none' : 'hover:-translate-y-0.5'}
                      `}
                    >
                      <span className="relative z-10">Comenzar</span>
                      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_40%)] opacity-60" aria-hidden="true" />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col gap-3 rounded-2xl border border-box-slot-border bg-bg-card/70 p-5 shadow-inner">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.12),transparent_35%)] opacity-60" aria-hidden="true" />
              <div className="pointer-events-none absolute inset-px rounded-2xl border border-box-slot-border/60" aria-hidden="true" />

              <p className="text-[10px] uppercase tracking-[0.25em] text-text-muted">Tips</p>
              <div className="space-y-3 text-xs text-text-main">
                <p className="rounded-xl border border-accent-blue/30 bg-accent-blue/10 px-3 py-2 shadow-[0_10px_30px_rgba(56,189,248,0.12)]">
                  Guarda tu nombre y avatar; sincronizamos tus capturas en Supabase.
                </p>
                <p className="rounded-xl border border-accent-yellow/30 bg-accent-yellow/10 px-3 py-2 shadow-[0_10px_30px_rgba(250,204,21,0.12)]">
                  Usa la Pokédex para atrapar, luego revisa tu Pokebox con tu perfil.
                </p>
                <p className="rounded-xl border border-accent-red/30 bg-accent-red/10 px-3 py-2 shadow-[0_10px_30px_rgba(239,68,68,0.12)]">
                  Recuerda encender tu dispositivo para acceder al modo captura.
                </p>
              </div>
            </div>
          </div>

          <p className="relative mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-text-muted">© 1996 Nintendo / Game Freak</p>
        </div>
      </div>
    </div>
  )
}

export default Login
