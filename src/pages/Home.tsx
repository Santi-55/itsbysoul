import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { services } from '../data/services'

export default function Home() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-16">
      {/* Hero */}
      <section ref={ref} className="relative overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 -z-10 opacity-60">
          <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1880&auto=format&fit=crop" alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/60 to-zinc-950" />
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl font-extrabold tracking-tight"
          >
            Fotografía y contenido audiovisual
            <span className="block text-brand-400">By SOULTRIP</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 text-lg text-zinc-300 max-w-2xl"
          >
            Transformamos ideas en experiencias visuales. A través de fotografía y producción audiovisual, creamos contenido que comunica con fuerza, emoción y coherencia estética. Cada proyecto nace desde una visión creativa que prioriza el detalle, la autenticidad y el impacto visual.
          </motion.p>
          <div className="mt-8 flex gap-3">
            <a href="/portfolio" className="px-5 py-3 rounded-md bg-brand-700 hover:bg-brand-600 text-white transition-transform will-change-transform hover:-translate-y-0.5">Ver portafolio</a>
            <a href="/contact" className="px-5 py-3 rounded-md border border-zinc-700 hover:border-brand-600 transition-transform will-change-transform hover:-translate-y-0.5">Agendar</a>
          </div>
        </div>
      </section>

      {/* Services teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h3 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl font-semibold">Servicios</motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {services.slice(0, 3).map((s) => (
            <motion.a
              key={s.key}
              href="/services"
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl ring-1 ring-zinc-800 bg-zinc-900/40 block"
            >
              <h4 className="text-xl font-semibold text-white">{s.title}</h4>
              <p className="text-zinc-300 mt-2">{s.short}</p>
              <span className="inline-block mt-4 text-sm text-brand-400">{s.priceRange}</span>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Grid showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="aspect-[4/5] bg-zinc-900 rounded-xl overflow-hidden ring-1 ring-zinc-800"
            >
              <img src={`https://picsum.photos/seed/home-${i+1}/800/1000`} alt="sample" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </motion.div>
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
