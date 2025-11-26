import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { services } from '../data/services'

export default function Services() {
  const [open, setOpen] = useState<string | null>(services[0]?.key ?? null)
  const [reqOpen, setReqOpen] = useState(false)
  const [reqService, setReqService] = useState<string>('')
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setReqOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const openRequest = (serviceTitle: string) => {
    setReqService(serviceTitle)
    setReqOpen(true)
  }

  const submitRequest = () => {
    const phone = '573165795209'
    const text = `Hola, soy ${name || '—'}. Me interesa el servicio "${reqService}".\nNotas: ${notes || '—'}`
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    setReqOpen(false)
    setName(''); setNotes('')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold">Fotografía</motion.h2>
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
                        <button onClick={() => openRequest(s.title)} className="px-4 py-2 rounded-md bg-brand-700 hover:bg-brand-600 text-white">Solicitar</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Modal de solicitud */}
        <AnimatePresence>
          {reqOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
              onClick={() => setReqOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold">Solicitar: {reqService}</h3>
                <p className="text-zinc-400 text-sm mt-1">Envíanos un WhatsApp con tus datos y nos pondremos en contacto.</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Tu nombre</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2" placeholder="Nombre" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Notas (opcional)</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2" rows={3} placeholder="Fecha, lugar, ideas..." />
                  </div>
                </div>
                <div className="mt-4 flex gap-3 justify-end">
                  <button onClick={() => setReqOpen(false)} className="px-4 py-2 rounded-md border border-zinc-700 hover:border-zinc-600">Cancelar</button>
                  <button onClick={submitRequest} className="px-4 py-2 rounded-md bg-brand-700 hover:bg-brand-600 text-white">Enviar por WhatsApp</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
