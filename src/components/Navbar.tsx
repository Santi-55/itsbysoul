import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const navItem = ({ to, label }: { to: string; label: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-brand-400' : 'text-zinc-300 hover:text-brand-400'}`
      }
      data-magnetic
    >
      {label}
    </NavLink>
  )

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-zinc-950/60 border-b border-zinc-800"
      data-magnetic-root
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-magnetic>
          <img src="/src/public/logonavbar.png" alt="itsbysoul" className="h-25 w-auto"/>  
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItem({ to: '/', label: 'Home' })}
          {navItem({ to: '/portfolio', label: 'Portafolio' })}
          {navItem({ to: '/about', label: 'Sobre mí' })}
          {navItem({ to: '/services', label: 'Servicios' })}
          {navItem({ to: '/contact', label: 'Contacto' })}
        </nav>

        {/* Mobile burger */}
        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden relative h-10 w-10 grid place-items-center rounded-md border border-zinc-800 hover:border-brand-600 bg-zinc-900/60 backdrop-blur shadow-sm"
          data-magnetic
        >
          {/* Animated burger to X */}
          <motion.span
            className="block h-0.5 w-5 bg-white rounded origin-center"
            animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
          <motion.span
            className="block h-0.5 w-5 bg-white rounded origin-center mt-1"
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block h-0.5 w-5 bg-white rounded origin-center mt-1"
            animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            className="md:hidden fixed inset-0 z-40 bg-zinc-950 border-b border-zinc-900"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                className="space-y-2"
              >
                {[
                  { to: '/', label: 'Home' },
                  { to: '/portfolio', label: 'Portafolio' },
                  { to: '/about', label: 'Sobre mí' },
                  { to: '/services', label: 'Servicios' },
                  { to: '/contact', label: 'Contacto' },
                ].map((i) => (
                  <motion.li key={i.to} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -1 }}>
                    <NavLink
                      to={i.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => {
                        const base = 'block w-full px-4 py-3 rounded-lg ring-1 text-sm font-medium transition-colors'
                        const active = 'bg-brand-700 ring-brand-600 text-white'
                        const idle = 'bg-zinc-900 ring-zinc-700 text-zinc-100 hover:bg-zinc-800 hover:ring-brand-600'
                        return `${base} ${isActive ? active : idle}`
                      }}
                      data-magnetic
                    >
                      <span className="flex items-center justify-between">
                        <span>{i.label}</span>
                        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 opacity-80"><path fill="currentColor" d="M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"/></svg>
                      </span>
                    </NavLink>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
