import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { services } from '../data/services'

export default function Services() {
  const [open, setOpen] = useState<string | null>(services[0]?.key ?? null)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold">Servicios</motion.h2>
        <p className="text-zinc-300 mt-3">Explora cada servicio para ver descripción y precios aproximados.</p>

        <div className="mt-10 space-y-4">
          {services.map((s) => {
            const isOpen = open === s.key
            return (
              <div key={s.key} className="rounded-2xl ring-1 ring-zinc-800 overflow-hidden bg-zinc-900/40">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : s.key)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-900/60 focus:outline-none"
                  data-magnetic
                >
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">{s.title}</h3>
                    <p className="text-zinc-400 text-sm">{s.short}</p>
                  </div>
                  <span className={`ml-4 shrink-0 text-sm px-3 py-1 rounded-full border ${isOpen ? 'border-brand-600 text-brand-400' : 'border-zinc-700 text-zinc-300'}`}>{s.priceRange}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 pb-5"
                    >
                      <ul className="list-disc pl-6 text-zinc-300 space-y-1">
                        {s.details.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                      <div className="mt-4 flex gap-3">
                        <a data-magnetic href={`/services/${s.key}`} className="px-4 py-2 rounded-md border border-zinc-700 hover:border-brand-600">Ver detalle</a>
                        <a data-magnetic href="/contact" className="px-4 py-2 rounded-md bg-brand-700 hover:bg-brand-600 text-white">Solicitar cotización</a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
