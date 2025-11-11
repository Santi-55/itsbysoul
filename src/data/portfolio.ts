export type PortfolioItem = {
  id: string
  title: string
  category: 'retratos' | 'eventos' | 'moda' | 'producto' | 'reels'
  src: string
  ratio?: string
}

export const categories = [
  { key: 'all', label: 'Todo' },
  { key: 'retratos', label: 'Retratos' },
  { key: 'eventos', label: 'Eventos' },
  { key: 'moda', label: 'Moda' },
  { key: 'producto', label: 'Producto' },
  { key: 'reels', label: 'Reels' },
] as const

// Auto-descubrimiento de imágenes en src/assets/portfolio/<categoria>/
// Soporta: jpg, jpeg, png, webp, avif
const globs = {
  retratos: import.meta.glob('../assets/portfolio/retratos/*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' }) as Record<string, string>,
  eventos: import.meta.glob('../assets/portfolio/eventos/*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' }) as Record<string, string>,
  moda: import.meta.glob('../assets/portfolio/moda/*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' }) as Record<string, string>,
  producto: import.meta.glob('../assets/portfolio/producto/*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' }) as Record<string, string>,
  reels: import.meta.glob('../assets/portfolio/reels/*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' }) as Record<string, string>,
}

function ratioClassFromFilename(path: string): string | undefined {
  // Puedes forzar relación en el nombre del archivo: _square, _34, _45
  if (/_square\./.test(path)) return 'aspect-square'
  if (/_34\./.test(path)) return 'aspect-[3/4]'
  if (/_45\./.test(path)) return 'aspect-[4/5]'
  return undefined
}

export function getItems(): PortfolioItem[] {
  const out: PortfolioItem[] = []
  const cats = ['retratos','eventos','moda','producto','reels'] as const
  cats.forEach((cat: keyof typeof globs) => {
    const entries = Object.entries(globs[cat])
    entries.forEach(([path, url], idx) => {
      const file = path.split('/').pop() || ''
      out.push({
        id: `${cat}-${idx}-${file}`,
        title: file.replace(/\.[^.]+$/, ''),
        category: cat as 'retratos' | 'eventos' | 'moda' | 'producto' | 'reels',
        src: url as string,
        ratio: ratioClassFromFilename(file),
      })
    })
  })
  // Orden por nombre para estabilidad
  return out.sort((a, b) => a.id.localeCompare(b.id))
}

export const uploadGuide = `
Cómo subir tus fotos (auto):
1) Copia tus imágenes en estas carpetas:
   - src/assets/portfolio/retratos
   - src/assets/portfolio/eventos
   - src/assets/portfolio/moda
   - src/assets/portfolio/producto
   - src/assets/portfolio/reels
2) Guarda y Vite recargará: se detectan automáticamente con import.meta.glob.
3) Opcional: añade sufijos al nombre para relación de aspecto:
   *_square.*  *_34.*  *_45.*
`
