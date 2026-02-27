import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TrainerCard from '../components/TrainerCard.jsx'
import Pokebox from './Pokebox'
import { supabase } from './client.js'

const PokeboxPage = () => {
  const navigate = useNavigate()
  const [trainer, setTrainer] = useState(() => localStorage.getItem('trainer_current') || 'Entrenador')
  const [trainerInput, setTrainerInput] = useState(() => localStorage.getItem('trainer_current') || 'Entrenador')
  const [loading, setLoading] = useState(false)
  const [pokemons, setPokemons] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [renamingId, setRenamingId] = useState(null)
  const [search, setSearch] = useState('')

  const loadBox = async () => {
    setLoading(true)
    try {
      const currentTrainer = localStorage.getItem('trainer_current') || trainer
      setTrainer(currentTrainer)
      setTrainerInput(currentTrainer)

      const { data, error } = await supabase
        .from('pokemons')
        .select('id,name,image,type,is_shiny,rarity')
        .eq('trainer', currentTrainer)
        .ilike('name', `%${search}%`)
        .order('id', { ascending: false })

      if (error) throw error
      setPokemons(data || [])
    } catch (err) {
      console.error('Error cargando caja:', err)
      setPokemons([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBox()
  }, [search])

  const handleTrainerChange = (e) => {
    const value = e.target.value
    setTrainerInput(value)
  }

  const handleTrainerSubmit = (e) => {
    e.preventDefault()
    const next = trainerInput.trim()
    if (!next) return
    localStorage.setItem('trainer_current', next)
    setTrainer(next)
    loadBox()
  }

  const shinyCount = pokemons.filter((p) => p.is_shiny).length

  const handleDelete = async (id) => {
    if (!id) return
    setDeletingId(id)
    try {
      const { error } = await supabase.from('pokemons').delete().eq('id', id)
      if (error) throw error
      await loadBox()
    } catch (err) {
      console.error('Error eliminando pokemon:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleRename = async (id, newName) => {
    if (!id || !newName) return
    setRenamingId(id)
    try {
      const { error } = await supabase
        .from('pokemons')
        .update({ name: newName })
        .eq('id', id)

      if (error) throw error
      await loadBox()
    } catch (err) {
      console.error('Error renombrando pokemon:', err)
    } finally {
      setRenamingId(null)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-bg-main via-bg-panel to-[#0b1020] px-4 py-10 text-text-main">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(250,204,21,0.1),transparent_30%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-holo opacity-[0.35]" aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.3em] text-text-muted">Centro de almacenamiento</p>
            <h1 className="text-3xl font-black text-white">Pokebox</h1>
            <p className="text-sm text-text-muted">Gestiona tus Pokémon capturados en Supabase</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/pokedex')}
              className="rounded-xl border border-box-border bg-bg-panel/70 px-4 py-2 font-semibold uppercase tracking-wide text-text-main shadow-[0_8px_0_rgba(15,23,42,0.9)] transition hover:-translate-y-0.5"
            >
              ⟵ Volver a Pokédex
            </button>
            <button
              onClick={loadBox}
              disabled={loading}
              className="rounded-xl border border-accent-yellow/70 bg-accent-yellow/90 px-4 py-2 font-black uppercase tracking-wide text-bg-main shadow-[0_8px_0_rgba(202,138,4,0.7)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
            >
              {loading ? 'Actualizando...' : 'Refrescar'}
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <TrainerCard name={trainer} caught={pokemons.length} shinies={shinyCount} />
          </div>
          <div className="rounded-2xl border border-box-border bg-bg-panel/70 p-4 shadow-neon backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.3em] text-text-muted">Búsqueda</p>
            <form onSubmit={(e) => { e.preventDefault(); loadBox() }} className="mt-3 flex gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar Pokémon"
                className="flex-1 rounded-xl border border-box-slot-border bg-bg-card/70 px-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              />
              <button
                type="submit"
                className="rounded-xl border border-accent-blue/70 bg-accent-blue/90 px-4 py-2 text-sm font-black uppercase tracking-wide text-bg-main shadow-[0_8px_0_rgba(14,165,233,0.7)] transition hover:-translate-y-0.5"
              >
                Buscar
              </button>
            </form>
            <p className="mt-3 text-xs text-text-muted">Filtra por nombre y sincroniza en tiempo real con tu Pokédex.</p>

            <div className="mt-4 rounded-xl border border-box-slot-border bg-bg-card/70 p-3 shadow-inner">
              <p className="text-[11px] uppercase tracking-[0.25em] text-text-muted">Entrenador activo</p>
              <form onSubmit={handleTrainerSubmit} className="mt-2 flex gap-2">
                <input
                  value={trainerInput}
                  onChange={handleTrainerChange}
                  placeholder="Nombre de entrenador"
                  className="flex-1 rounded-lg border border-box-slot-border bg-bg-panel/80 px-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:border-accent-yellow focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                />
                <button
                  type="submit"
                  className="rounded-lg border border-accent-yellow/70 bg-accent-yellow/90 px-3 py-2 text-xs font-black uppercase tracking-wide text-bg-main shadow-[0_6px_0_rgba(202,138,4,0.7)] transition hover:-translate-y-0.5 disabled:opacity-60"
                  disabled={loading}
                >
                  Cambiar
                </button>
              </form>
              <p className="mt-1 text-[11px] text-text-muted">Usamos este valor para filtrar en Supabase.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Pokebox
            pokemons={pokemons}
            loading={loading}
            trainer={trainer}
            onDelete={handleDelete}
            deletingId={deletingId}
            onRename={handleRename}
            renamingId={renamingId}
          />
        </div>
      </div>
    </div>
  )
}

export default PokeboxPage
