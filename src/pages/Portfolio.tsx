import { useEffect, useMemo, useRef, useState } from 'react'
import Lightbox from '../components/Lightbox'
import LazyImage from '../components/LazyImage'
import { categories, getItems, fetchCloudItems, fetchBlobItems } from '../data/portfolio'

export default function Portfolio() {
  const [active, setActive] = useState<(typeof categories)[number]['key']>('all')
  const [open, setOpen] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string | undefined>()
  const [currentTitle, setCurrentTitle] = useState<string | undefined>()
  const galleryRef = useRef<HTMLDivElement>(null)
  const [all, setAll] = useState(() => getItems())

  useEffect(() => {
    let mounted = true
    ;(async () => {
      // 1) Netlify Blobs
      const blobs = await fetchBlobItems()
      if (mounted && blobs.length > 0) {
        setAll(blobs)
        return
      }
      // 2) Cloudinary
      const cloud = await fetchCloudItems()
      if (mounted && cloud.length > 0) setAll(cloud)
    })()
    return () => {
      mounted = false
    }
  }, [])

  const data = useMemo(
    () => (active === 'all' ? all : all.filter((i) => i.category === active)),
    [active, all],
  )

  useEffect(() => {
    // Cierra lightbox; no forzamos scroll para evitar mini saltos
    setOpen(false)
  }, [active])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c.key}
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                setActive(c.key as any)
                ;(e.currentTarget as HTMLButtonElement).blur()
              }}
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
        <div ref={galleryRef} className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {data.length === 0 && (
            <p className="text-zinc-400">No hay imágenes en esta categoría todavía.</p>
          )}
          {data.map((ph) => (
            <button
              type="button"
              key={ph.id}
              onClick={() => {
                setCurrentSrc(ph.src)
                setCurrentTitle(ph.title)
                setOpen(true)
              }}
              className="block w-full break-inside-avoid mb-4 overflow-hidden rounded-xl ring-1 ring-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-600 hover:opacity-95 transition"
            >
              <LazyImage src={ph.src} alt={ph.title} className={`${ph.ratio ?? 'aspect-[4/5]'} bg-zinc-900`} />
            </button>
          ))}
        </div>
      </div>
      <Lightbox open={open} src={currentSrc} title={currentTitle} onClose={() => setOpen(false)} />
    </div>
  )
}
