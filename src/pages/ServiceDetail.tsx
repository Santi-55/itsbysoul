import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { services } from '../data/services'

export default function ServiceDetail() {
  const { key } = useParams()
  const svc = useMemo(() => services.find((s) => s.key === key), [key])

  if (!svc) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-zinc-300">Servicio no encontrado.</p>
          <Link to="/services" className="text-brand-400 hover:text-brand-300">Volver a servicios</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold">{svc.title}</motion.h1>
        <p className="text-zinc-400 mt-2">{svc.short}</p>
        <span className="inline-block mt-3 text-sm px-3 py-1 rounded-full border border-brand-600 text-brand-400">{svc.priceRange}</span>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-2">
            <h3 className="text-lg font-semibold">Incluye</h3>
            <ul className="list-disc pl-6 text-zinc-300">
              {svc.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-1">
            <div className="p-5 rounded-2xl ring-1 ring-zinc-800 bg-zinc-900/40">
              <p className="text-sm text-zinc-400">¿Te interesa este servicio?</p>
              <div className="mt-4 flex flex-col gap-2">
                <a data-magnetic href={`/contact`} className="px-4 py-2 rounded-md bg-brand-700 hover:bg-brand-600 text-white text-center">Solicitar cotización</a>
                <Link to="/services" className="px-4 py-2 rounded-md border border-zinc-700 text-center hover:border-brand-600">Ver todos</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
