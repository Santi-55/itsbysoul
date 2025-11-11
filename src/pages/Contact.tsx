import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Contact() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    servicio: 'Retratos',
    fecha: '',
    presupuesto: '',
    mensaje: '',
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const toWhatsApp = () => {
    const target = '573165795209'
    const text = `Hola, soy ${form.nombre}.%0A%0A` +
      `Me interesa el servicio: ${form.servicio}.%0A` +
      (form.fecha ? `Fecha tentativa: ${form.fecha}.%0A` : '') +
      (form.presupuesto ? `Presupuesto aprox.: ${form.presupuesto}.%0A` : '') +
      (form.email ? `Email: ${form.email}.%0A` : '') +
      (form.mensaje ? `%0ADetalles:%0A${encodeURIComponent(form.mensaje)}` : '')
    const url = `https://wa.me/${target}?text=${text}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold">Contacto</motion.h2>
        <p className="mt-6 text-zinc-300">Cuéntame sobre tu proyecto y te respondo con disponibilidad y propuesta.</p>

        <div className="mt-8 grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400">Nombre</label>
              <input name="nombre" value={form.nombre} onChange={onChange} className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 focus:outline-none focus:border-brand-600" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400">Email</label>
              <input type="email" name="email" value={form.email} onChange={onChange} className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 focus:outline-none focus:border-brand-600" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-zinc-400">Servicio</label>
              <select name="servicio" value={form.servicio} onChange={onChange} className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 focus:outline-none focus:border-brand-600">
                {['Retratos','Eventos','Moda','Producto','Reels'].map((s)=> (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400">Fecha tentativa</label>
              <input type="date" name="fecha" value={form.fecha} onChange={onChange} className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 focus:outline-none focus:border-brand-600" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400">Presupuesto (opcional)</label>
              <input name="presupuesto" value={form.presupuesto} onChange={onChange} placeholder="$" className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 focus:outline-none focus:border-brand-600" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400">Mensaje</label>
            <textarea name="mensaje" value={form.mensaje} onChange={onChange} rows={5} className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 focus:outline-none focus:border-brand-600" />
          </div>

          <div className="flex flex-wrap gap-3 mt-2">
            <button onClick={toWhatsApp} className="px-5 py-3 rounded-md bg-brand-700 hover:bg-brand-600 text-white">Enviar por WhatsApp</button>
            <a href="https://instagram.com/itsbysoul_" target="_blank" className="px-5 py-3 rounded-md border border-zinc-700 hover:border-brand-600">Instagram</a>
            <a href="mailto:eh591145@gmail.com" className="px-5 py-3 rounded-md border border-zinc-700 hover:border-brand-600">Email</a>
          </div>
        </div>
      </div>
    </div>
  )
}
