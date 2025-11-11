export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-zinc-400 text-sm grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <p className="text-white font-semibold">itsbysoul</p>
          <p className="mt-2">Soul — Fotógrafo y creador audiovisual en Pasto.</p>
          <p className="mt-2">Pasto, Nariño — Colombia</p>
        </div>
        <div>
          <p className="text-white font-semibold">Navegación</p>
          <ul className="mt-2 space-y-1">
            <li><a data-magnetic href="/" className="hover:text-brand-400">Home</a></li>
            <li><a data-magnetic href="/portfolio" className="hover:text-brand-400">Portafolio</a></li>
            <li><a data-magnetic href="/services" className="hover:text-brand-400">Servicios</a></li>
            <li><a data-magnetic href="/about" className="hover:text-brand-400">Sobre mí</a></li>
            <li><a data-magnetic href="/contact" className="hover:text-brand-400">Contacto</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold">Contacto</p>
          <ul className="mt-2 space-y-1">
            <li><a data-magnetic href="https://instagram.com/itsbysoul_" target="_blank" className="hover:text-brand-400">Instagram</a></li>
            <li><a data-magnetic href="mailto:eh591145@gmail.com" className="hover:text-brand-400">eh591145@gmail.com</a></li>
            <li><a data-magnetic href="https://wa.me/573165795209" target="_blank" className="hover:text-brand-400">WhatsApp +57 316 579 5209</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} itsbysoul — Todos los derechos reservados.</p>
          <p>Hecho con ❤️ en Pasto</p>
        </div>
      </div>
    </footer>
  )
}
