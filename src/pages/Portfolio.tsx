import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Lightbox from '../components/Lightbox'
import LazyImage from '../components/LazyImage'
import { categories, getItems } from '../data/portfolio'

export default function Portfolio() {
  const [active, setActive] = useState<(typeof categories)[number]['key']>('all')
  const [open, setOpen] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string | undefined>()
  const [currentTitle, setCurrentTitle] = useState<string | undefined>()

  const all = useMemo(() => getItems(), [])
  const data = useMemo(
    () => (active === 'all' ? all : all.filter((i) => i.category === active)),
    [active, all],
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key as any)}
              className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                active === c.key
                  ? 'border-brand-600 text-white'
                  : 'border-zinc-800 text-zinc-300 hover:text-white hover:border-brand-500'
              }`}
              data-magnetic
            >
              {c.label}
            </button>
          ))}
        </div>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]"
        >
          {data.map((ph) => (
            <motion.button
              type="button"
              key={ph.id}
              onClick={() => {
                setCurrentSrc(ph.src)
                setCurrentTitle(ph.title)
                setOpen(true)
              }}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="break-inside-avoid mb-4 overflow-hidden rounded-xl ring-1 ring-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              <LazyImage src={ph.src} alt={ph.title} className={`${ph.ratio ?? 'aspect-[4/5]'} bg-zinc-900`} />
            </motion.button>
          ))}
        </motion.div>
      </div>
      <Lightbox open={open} src={currentSrc} title={currentTitle} onClose={() => setOpen(false)} />
    </div>
  )
}
