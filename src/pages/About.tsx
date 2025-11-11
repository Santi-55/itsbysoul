import { motion } from 'framer-motion'

export default function About() {
  const highlights = [
    { k: 'estilo', v: 'Oscuro, contraste profundo, narrativa' },
    { k: 'ciudad', v: 'Pasto, Nariño' },
    { k: 'servicios', v: 'Retratos, eventos, moda, producto, reels' },
  ]

  const timeline = [
    { year: '2023–2025', title: 'Creador independiente', desc: 'Cobertura de eventos locales, sesiones editoriales y campañas de marca.' },
    { year: '2022', title: 'Inicio del portafolio', desc: 'Exploración de color grading, iluminación y dirección de arte.' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold">Sobre mí</motion.h2>
        <motion.p initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6 text-zinc-300 max-w-3xl">
          Soy Soul (itsbysoul_), fotógrafo y creador de contenido audiovisual en Pasto. Mi trabajo busca capturar la esencia de cada persona o proyecto con una estética cinematográfica.
        </motion.p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlights.map((h) => (
            <motion.div key={h.k} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 rounded-2xl ring-1 ring-zinc-800 bg-zinc-900/40">
              <p className="text-sm text-zinc-400">{h.k}</p>
              <p className="text-white text-lg mt-1">{h.v}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <motion.h3 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl font-semibold">Trayectoria</motion.h3>
          <div className="mt-6 space-y-6">
            {timeline.map((t) => (
              <motion.div key={t.title} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                <div>
                  <p className="text-zinc-400 text-sm">{t.year}</p>
                  <h4 className="text-white font-semibold">{t.title}</h4>
                  <p className="text-zinc-300">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
