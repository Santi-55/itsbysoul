export type PortfolioItem = {
  id: string
  title: string
  category: 'retratos' | 'eventos' | 'moda' | 'producto' | 'reels' | 'paisajes'
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
  { key: 'paisajes', label: 'Paisajes' },
] as const

// Auto-descubrimiento de imágenes en src/assets/portfolio/<categoria>/
// Soporta: jpg, jpeg, png, webp, avif (mayúsculas y minúsculas)
const globs = {
  retratos: import.meta.glob('../assets/portfolio/retratos/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}', { eager: true, as: 'url' }) as Record<string, string>,
  eventos: import.meta.glob('../assets/portfolio/eventos/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}', { eager: true, as: 'url' }) as Record<string, string>,
  moda: import.meta.glob('../assets/portfolio/moda/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}', { eager: true, as: 'url' }) as Record<string, string>,
  producto: import.meta.glob('../assets/portfolio/producto/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}', { eager: true, as: 'url' }) as Record<string, string>,
  reels: import.meta.glob('../assets/portfolio/reels/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}', { eager: true, as: 'url' }) as Record<string, string>,
  paisajes: import.meta.glob('../assets/portfolio/paisajes/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}', { eager: true, as: 'url' }) as Record<string, string>,
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
  const cats = ['retratos','eventos','moda','producto','reels','paisajes'] as const
  cats.forEach((cat: keyof typeof globs) => {
    const entries = Object.entries(globs[cat])
    entries.forEach(([path, url]) => {
      const file = path.split('/').pop() || ''
      out.push({
        id: `${cat}-${file}`,
        title: file.replace(/\.[^.]+$/, ''),
        category: cat as 'retratos' | 'eventos' | 'moda' | 'producto' | 'reels' | 'paisajes',
        src: url as string,
        ratio: ratioClassFromFilename(file),
      })
    })
  })
  // Orden por nombre para estabilidad
  return out.sort((a, b) => a.title.localeCompare(b.title))
}

// Carga desde Netlify Blobs por categorías usando la Netlify Function.
export async function fetchBlobItems(): Promise<PortfolioItem[]> {
  try {
    const res = await fetch('/.netlify/functions/list-blob', { method: 'GET' })
    if (!res.ok) throw new Error('blob list failed')
    const j = (await res.json()) as { items?: any[] }
    const items = (j.items || []).map((r) => ({
      id: r.id,
      title: r.title || (r.id ? String(r.id).split('/').pop() : ''),
      category: r.category,
      src: r.src,
    })) as PortfolioItem[]
    return items.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
  } catch {
    return []
  }
}

// Carga desde Cloudinary por categorías usando la Netlify Function.
// Si la función no está disponible en desarrollo local, los consumidores deben hacer fallback a getItems().
export async function fetchCloudItems(): Promise<PortfolioItem[]> {
  try {
    const res = await fetch('/.netlify/functions/list-cloudinary', { method: 'GET' })
    if (!res.ok) throw new Error('cloud list failed')
    const j = (await res.json()) as { items?: any[] }
    const items = (j.items || []).map((r) => ({
      id: r.id || r.public_id,
      title: r.title || (r.id ? String(r.id).split('/').pop() : ''),
      category: r.category,
      src: r.src || r.secure_url,
    })) as PortfolioItem[]
    // Orden estable por título
    return items.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
  } catch {
    return []
  }
}
export const uploadGuide = `
Cómo subir tus fotos (auto):
1) Copia tus imágenes en estas carpetas:
   - src/assets/portfolio/retratos
   - src/assets/portfolio/eventos
   - src/assets/portfolio/moda
   - src/assets/portfolio/producto
   - src/assets/portfolio/reels
   - src/assets/portfolio/paisajes
2) Guarda y Vite recargará: se detectan automáticamente con import.meta.glob.
3) Opcional: añade sufijos al nombre para relación de aspecto:
   *_square.*  *_34.*  *_45.*
`
