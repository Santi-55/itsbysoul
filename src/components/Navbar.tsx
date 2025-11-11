import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
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
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-magnetic>
          <span className="text-white font-bold tracking-widest text-lg">ITSBY<span className="text-brand-500">SOUL</span></span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItem({ to: '/', label: 'Home' })}
          {navItem({ to: '/portfolio', label: 'Portafolio' })}
          {navItem({ to: '/about', label: 'Sobre mí' })}
          {navItem({ to: '/services', label: 'Servicios' })}
          {navItem({ to: '/contact', label: 'Contacto' })}
        </nav>
      </div>
    </motion.header>
  )
}
