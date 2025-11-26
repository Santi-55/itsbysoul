import { useEffect, useMemo, useRef, useState } from 'react'

const CATEGORIES = ['retratos', 'eventos', 'moda', 'producto', 'reels', 'paisajes'] as const

type Cat = typeof CATEGORIES[number]

type SignResponse = {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string
  uploadUrl: string
}

export default function AdminUpload() {
  const [adminKey, setAdminKey] = useState('')
  const [category, setCategory] = useState<Cat>('retratos')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [mode, setMode] = useState<'netlify' | 'github' | 'cloudinary'>('netlify')
  const [ghToken, setGhToken] = useState('')
  const [ghRepo, setGhRepo] = useState('') // owner/repo
  const [listing, setListing] = useState<{ name: string; path: string; sha: string }[]>([])
  const [loadingList, setLoadingList] = useState(false)

  const canUpload = useMemo(() => {
    if (mode === 'github') return ghToken && ghRepo && files.length > 0
    return files.length > 0
  }, [mode, ghToken, ghRepo, adminKey, files.length])

  const onPick = () => inputRef.current?.click()

  const handleFiles = (fl: FileList | null) => {
    if (!fl) return
    setFiles(Array.from(fl))
  }

  const appendLog = (s: string) => setLog((l) => [s, ...l].slice(0, 200))

  const refreshGithubList = async () => {
    if (!ghToken || !ghRepo) return
    try {
      setLoadingList(true)
      const [owner, repo] = ghRepo.split('/')
      const folder = `src/assets/portfolio/${category}`
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(folder)}`, {
        headers: { Authorization: `Bearer ${ghToken}`, 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('No se pudo listar la carpeta (verifica token/repo)')
      const data = await res.json()
      const files = Array.isArray(data)
        ? data.filter((x: any) => x.type === 'file').map((x: any) => ({ name: x.name, path: x.path, sha: x.sha }))
        : []
      setListing(files)
    } catch (e: any) {
      appendLog(`✖ Listado: ${e?.message || 'Error'}`)
    } finally {
      setLoadingList(false)
    }
  }

  // Auto refresh when switching category in GitHub mode
  useEffect(() => {
    if (mode === 'github' && ghToken && ghRepo) refreshGithubList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, ghToken, ghRepo, category])

  const deleteGithubFile = async (item: { path: string; sha: string; name: string }) => {
    try {
      const [owner, repo] = ghRepo.split('/')
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(item.path)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${ghToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `chore(portfolio): delete ${item.name}`, sha: item.sha, branch: 'main' }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.message || 'Error al eliminar')
      appendLog(`✓ Eliminado: ${item.name}`)
      refreshGithubList()
    } catch (e: any) {
      appendLog(`✖ Eliminar: ${e?.message || 'Error'}`)
    }
  }

  const upload = async () => {
    if (!canUpload) return
    setBusy(true)
    try {
      if (mode === 'netlify') {
        // Subida a Netlify Blobs (sin cuentas externas)
        for (const file of files) {
          const fd = new FormData()
          fd.append('category', category)
          fd.append('file', file, file.name)
          const up = await fetch('/.netlify/functions/upload-blob', { method: 'POST', body: fd })
          const j = await up.json().catch(() => ({}))
          if (!up.ok) throw new Error(j?.message || 'Fallo subiendo a Netlify Blobs')
          appendLog(`OK Netlify: ${file.name}`)
        }
        appendLog('✔ Listo. Imágenes disponibles desde Netlify Blobs al instante.')
      } else if (mode === 'github') {
        // Subida directa a GitHub (Commit a repo conectado a Netlify)
        // Requiere token con scope 'repo'. No se almacena; lo introduces cada vez.
        const [owner, repo] = ghRepo.split('/')
        if (!owner || !repo) throw new Error('Repo inválido. Formato: owner/repo')

        for (const file of files) {
          const arrayBuf = await file.arrayBuffer()
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuf)))
          const path = `src/assets/portfolio/${category}/${file.name}`
          // Intentar obtener SHA si el archivo existe
          let sha: string | undefined
          const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
            headers: { Authorization: `Bearer ${ghToken}`, 'Content-Type': 'application/json' },
          })
          if (getRes.ok) {
            const j = await getRes.json()
            sha = j.sha
          }
          const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${ghToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `feat(portfolio): add ${category} image ${file.name}${description ? ` - ${description}` : ''}`,
              content: base64,
              branch: 'main',
              sha,
            }),
          })
          const cj = await commitRes.json()
          if (!commitRes.ok) throw new Error(cj?.message || 'Error subiendo a GitHub')
          appendLog(`OK GitHub: ${file.name}`)
        }
        appendLog('✔ Listo. Netlify detectará el push y hará deploy automático.')
      } else {
        // Cloudinary (requiere variables en Netlify ya configuradas)
        const signRes = await fetch('/.netlify/functions/sign-cloudinary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Key': adminKey,
          },
          body: JSON.stringify({ folder: `itsbysoul/portfolio/${category}`, tags: [category] }),
        })
        if (!signRes.ok) throw new Error('Error firmando la subida')
        const sign: SignResponse = await signRes.json()

        for (const file of files) {
          const fd = new FormData()
          fd.append('file', file)
          fd.append('api_key', sign.apiKey)
          fd.append('timestamp', String(sign.timestamp))
          fd.append('signature', sign.signature)
          fd.append('folder', sign.folder)
          if (description) fd.append('context', `caption=${description}`)
          const up = await fetch(sign.uploadUrl, { method: 'POST', body: fd })
          const j = await up.json()
          if (!up.ok) throw new Error(j?.error?.message || 'Fallo subiendo')
          appendLog(`OK Cloudinary: ${j.public_id}`)
        }
        appendLog('✔ Listo. Imágenes disponibles desde Cloudinary al instante.')
      }

      setFiles([])
      setDescription('')
    } catch (e: any) {
      appendLog(`✖ ${e?.message || 'Error subiendo'}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-semibold mb-6">Panel privado de subida</h1>
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 p-1 text-sm">
            <button onClick={() => setMode('netlify')} className={`px-3 py-1.5 rounded ${mode==='netlify'?'bg-zinc-800 text-white':'text-zinc-300 hover:text-white'}`}>Vía Netlify (fácil)</button>
            <button onClick={() => setMode('github')} className={`px-3 py-1.5 rounded ${mode==='github'?'bg-zinc-800 text-white':'text-zinc-300 hover:text-white'}`}>Vía GitHub</button>
            <button onClick={() => setMode('cloudinary')} className={`px-3 py-1.5 rounded ${mode==='cloudinary'?'bg-zinc-800 text-white':'text-zinc-300 hover:text-white'}`}>Vía Cloudinary</button>
          </div>
          <p className="mt-2 text-xs text-zinc-400">Netlify: sube sin cuentas externas. GitHub: hace commit al repo. Cloudinary: hosting externo (requiere variables).</p>
        </div>
        <p className="text-sm text-zinc-400 mb-6">Ingresa tu clave de administrador para subir imágenes por categoría. Esta página no está enlazada en el sitio.</p>

        <div className="space-y-4">
          {mode === 'github' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">GitHub Token (repo scope)</label>
                <input
                  type="password"
                  value={ghToken}
                  onChange={(e) => setGhToken(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2"
                  placeholder="ghp_..."
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Repo (owner/repo)</label>
                <input
                  value={ghRepo}
                  onChange={(e) => setGhRepo(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2"
                  placeholder="Santi-55/itsbysoul"
                />
              </div>
            </div>
          ) : mode === 'cloudinary' ? (
            <div>
              <label className="block text-sm mb-1">Admin Key</label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2"
                placeholder="Tu clave secreta"
              />
            </div>
          ) : (
            <div className="text-sm text-zinc-400">Modo Netlify: no requiere configuración adicional.</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Cat)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Descripción (opcional)</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2"
                placeholder="Descripción breve de la imagen"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Imágenes</label>
            <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            <button onClick={onPick} className="px-4 py-2 rounded-md border border-zinc-700 hover:border-brand-600">Seleccionar archivos</button>
            {files.length > 0 && (
              <p className="mt-2 text-sm text-zinc-400">{files.length} archivo(s) seleccionados</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={!canUpload || busy}
              onClick={upload}
              className={`px-5 py-2 rounded-md ${busy ? 'bg-zinc-800' : 'bg-brand-700 hover:bg-brand-600'} text-white disabled:opacity-50`}
            >
              {busy ? 'Subiendo…' : mode==='netlify' ? 'Subir a Netlify' : mode==='github' ? 'Subir a GitHub' : 'Subir a Cloudinary'}
            </button>
            <a href="/portfolio" className="text-sm text-zinc-400 hover:text-zinc-200">Ver Portafolio</a>
          </div>

          {mode === 'github' && (
            <div className="mt-8 border border-zinc-800 rounded-md p-4 bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Galería en {`src/assets/portfolio/${category}`}</h3>
                <button onClick={refreshGithubList} className="text-sm px-3 py-1.5 rounded-md border border-zinc-700 hover:border-brand-600">
                  {loadingList ? 'Actualizando…' : 'Actualizar'}
                </button>
              </div>
              <ul className="mt-3 divide-y divide-zinc-800">
                {listing.length === 0 && <li className="py-3 text-sm text-zinc-400">No hay imágenes aún.</li>}
                {listing.map((it) => (
                  <li key={it.sha} className="py-3 flex items-center justify-between text-sm">
                    <span className="truncate mr-4">{it.name}</span>
                    <button onClick={() => deleteGithubFile(it)} className="px-3 py-1.5 rounded-md border border-red-700 text-red-300 hover:bg-red-800/20">Eliminar</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 border border-zinc-800 rounded-md p-3 bg-zinc-900/50">
            <div className="text-sm mb-2 text-zinc-400">Registro</div>
            <ul className="space-y-1 text-sm">
              {log.map((l, i) => (
                <li key={i} className="text-zinc-300">{l}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
