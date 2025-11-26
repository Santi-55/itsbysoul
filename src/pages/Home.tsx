import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import LazyImage from '../components/LazyImage'
import { getItems, fetchCloudItems, fetchBlobItems } from '../data/portfolio'

export default function Home() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const [latest, setLatest] = useState(() => getItems().slice(-9).reverse())

  useEffect(() => {
    let mounted = true
    ;(async () => {
      // 1) Netlify Blobs
      const blobs = await fetchBlobItems()
      if (mounted && blobs.length > 0) {
        setLatest([...blobs].slice(-9).reverse())
        return
      }
      // 2) Cloudinary
      const cloud = await fetchCloudItems()
      if (mounted && cloud.length > 0) setLatest([...cloud].slice(-9).reverse())
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-16">
      {/* Hero */}
      <section ref={ref} className="relative overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black" />
          <div className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-brand-700/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-10 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl font-extrabold tracking-tight"
          >
            Soy Soul (itsbysoul_)
            <span className="block text-brand-400">Fotografía y Marketing</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 text-lg text-zinc-300 max-w-2xl"
          >
            Soy Soul (itsbysoul_). Retratos, eventos, moda y producto; diseño y administración de redes; creación de páginas web. Estética oscura y contraste profundo.
          </motion.p>
          <div className="mt-8 flex gap-3">
            <a href="/fotografia" className="px-5 py-3 rounded-md bg-brand-700 hover:bg-brand-600 text-white transition-transform will-change-transform hover:-translate-y-0.5">Ver Fotografía</a>
            <a href="/marketing" className="px-5 py-3 rounded-md border border-zinc-700 hover:border-brand-600 transition-transform will-change-transform hover:-translate-y-0.5">Planes de Marketing</a>
          </div>
        </div>
      </section>

      {/* Servicios principales */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h3 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl font-semibold">Servicios principales</motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <a href="/fotografia" className="p-6 rounded-2xl ring-1 ring-zinc-800 bg-zinc-900/40 block hover:ring-brand-600 transition">
            <h4 className="text-xl font-semibold">Fotografía y Video</h4>
            <p className="text-zinc-300 mt-2">Retratos, eventos, moda, producto y reels. Dirección creativa y entrega lista para redes.</p>
            <span className="inline-block mt-4 text-sm text-brand-400">Explorar →</span>
          </a>
          <a href="/marketing" className="p-6 rounded-2xl ring-1 ring-zinc-800 bg-zinc-900/40 block hover:ring-brand-600 transition">
            <h4 className="text-xl font-semibold">Marketing y Diseño</h4>
            <p className="text-zinc-300 mt-2">Gestión de redes, diseño de flyers/carruseles, contenido mensual y páginas web.</p>
            <span className="inline-block mt-4 text-sm text-brand-400">Ver planes →</span>
          </a>
        </div>
      </section>

      {/* Últimos trabajos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h3 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl font-semibold">Últimos trabajos</motion.h3>
        <div className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {useMemo(() => latest, [latest]).map((ph) => (
            <a key={ph.id} href="/portfolio" className="block break-inside-avoid mb-4 overflow-hidden rounded-xl ring-1 ring-zinc-800 hover:opacity-95 transition">
              <LazyImage src={ph.src} alt={ph.title} className={`${ph.ratio ?? 'aspect-[4/5]'} bg-zinc-900`} />
            </a>
          ))}
        </div>
      </section>

     

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.h3 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl font-semibold">Testimonios</motion.h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { n: 'Cliente A', t: 'La cobertura del evento fue impecable. Capturó momentos clave con mucha sensibilidad.' },
            { n: 'Cliente B', t: 'Los retratos tienen una estética brutal. La dirección de arte fue precisa.' },
            { n: 'Marca C', t: 'Contenido para redes a tiempo y con gran impacto visual.' },
          ].map((c) => (
            <motion.blockquote key={c.n} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 rounded-2xl ring-1 ring-zinc-800 bg-zinc-900/40">
              <p className="text-zinc-200">“{c.t}”</p>
              <footer className="mt-3 text-sm text-zinc-400">— {c.n}</footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.h3 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl font-semibold">Marcas</motion.h3>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 opacity-80">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="h-10 rounded-md bg-zinc-800/60" />
          ))}
        </div>
      </section>
    </div>
  )
}
