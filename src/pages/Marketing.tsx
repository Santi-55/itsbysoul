import { motion } from 'framer-motion'

const plans = [
  {
    key: 'starter-rrss',
    title: 'Starter RRSS',
    price: 590000,
    features: [
      '12 posts (estáticos) + 8 stories al mes',
      'Calendario editorial y copywriting',
      'Diseño (flyers, carruseles)',
      'Programación y publicación',
      'Reporte básico (alcance, impresiones, top posts)'
    ],
    bestFor: 'Negocios que inician o necesitan presencia constante',
  },
  {
    key: 'creator',
    title: 'Creator (Foto/Video)',
    price: 890000,
    features: [
      '1 sesión mensual on-site (hasta 3h)',
      '20 fotos editadas (HQ) + 4 reels (15–30s)',
      'Dirección creativa simple (moodboard)',
      'Entrega lista para RRSS'
    ],
    bestFor: 'Marcas que requieren producción mensual',
  },
  {
    key: 'full-content',
    title: 'Full Content',
    price: 1490000,
    features: [
      '1 sesión mensual (3–4h)',
      '24 posts + 12 stories (diseño + textos)',
      '30 fotos editadas + 6 reels (hasta 30s)',
      'Programación y respuesta básica',
      'Reporte con insights y recomendaciones'
    ],
    highlight: true,
    bestFor: 'Negocios que buscan crecimiento sostenido',
  },
  {
    key: 'web-rrss',
    title: 'Web + RRSS',
    subtitle: 'Primer mes',
    price: 2190000,
    features: [
      'Landing web (1–3 secciones) + SEO básico',
      'Setup analítica (GA4, tags)',
      '12 posts + 8 stories',
      'A partir del mes 2: $1.190.000 (mantenimiento web + Starter RRSS)'
    ],
    bestFor: 'Quienes necesitan sitio y presencia digital',
  },
  {
    key: 'pro-growth',
    title: 'Pro Growth',
    price: 3490000,
    features: [
      '2 sesiones mensuales (hasta 4h c/u)',
      '50 fotos editadas + 10 reels (30–45s)',
      '20 posts + 16 stories (variaciones por plataforma)',
      'Gestión de pauta básica (Meta Ads) hasta $500k (no incluye presupuesto)',
      'Reporte con KPI avanzados y plan de acción'
    ],
    bestFor: 'Marcas con alta ambición y ritmo de contenido',
  }
]

function currency(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

export default function Marketing() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-extrabold">
            Planes de Marketing
          </motion.h1>
          <p className="mt-2 text-zinc-300">Administración de redes sociales, producción de contenido y diseño, con precios competitivos en COP.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => (
            <motion.div key={p.key} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className={`rounded-2xl border ${p.highlight ? 'border-brand-600 bg-zinc-900/60' : 'border-zinc-800 bg-zinc-900/40'} p-6 flex flex-col`}
            >
              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  {p.subtitle && <span className="text-xs text-zinc-400">{p.subtitle}</span>}
                </div>
                <div className="mt-2 text-3xl font-extrabold text-brand-400">{currency(p.price)}<span className="text-sm text-zinc-400">/mes</span></div>
                <p className="mt-2 text-sm text-zinc-300">{p.bestFor}</p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-200">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <a href="/contact" className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-700 hover:bg-brand-600 text-white">Solicitar propuesta</a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-zinc-800 p-6 bg-zinc-900/40">
            <h4 className="font-semibold">Extras</h4>
            <ul className="mt-3 text-sm text-zinc-300 space-y-2">
              <li>Community management extendido</li>
              <li>Pauta adicional (Meta/Google)</li>
              <li>Branding: logo y guía de estilo</li>
              <li>Web multi-sección y ecommerce</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-800 p-6 bg-zinc-900/40">
            <h4 className="font-semibold">Proceso</h4>
            <ul className="mt-3 text-sm text-zinc-300 space-y-2">
              <li>Brief y objetivos</li>
              <li>Calendario y guion creativo</li>
              <li>Producción/edición</li>
              <li>Publicación y medición</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-800 p-6 bg-zinc-900/40">
            <h4 className="font-semibold">Resultados</h4>
            <p className="mt-3 text-sm text-zinc-300">Reportes mensuales con aprendizajes accionables para optimizar tu crecimiento.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
