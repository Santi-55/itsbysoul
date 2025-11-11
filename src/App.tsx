import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
// Lenis deshabilitado temporalmente por issues de scroll

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Portafolio from './pages/Portfolio'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import ServiceDetail from './pages/ServiceDetail'

function AppInner() {
  const location = useLocation()

  useEffect(() => {
    // Smooth scroll desactivado por ahora
  }, [])

  // Magnetic buttons: translate element slightly toward pointer
  useEffect(() => {
    const isDesktop = window.matchMedia('(pointer: fine)').matches
    if (!isDesktop) return
    let current: HTMLElement | null = null
    const onMove = (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement
      // Only act if inside a magnetic root (Navbar)
      const root = targetEl.closest('[data-magnetic-root]')
      if (!root) return
      const target = targetEl.closest('[data-magnetic]') as HTMLElement | null
      if (!target) return
      current = target
      const rect = target.getBoundingClientRect()
      const mx = e.clientX - rect.left - rect.width / 2
      const my = e.clientY - rect.top - rect.height / 2
      const tx = Math.max(-10, Math.min(10, mx * 0.15))
      const ty = Math.max(-10, Math.min(10, my * 0.15))
      target.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
    }
    const onLeave = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)
      if (t?.matches('[data-magnetic]')) t.style.transform = ''
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseout', onLeave)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseout', onLeave)
      if (current) current.style.transform = ''
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  const Page = ({ children }: { children: React.ReactNode }) => (
    <motion.main
      key={location.pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.main>
  )

  return (
    <>
      <Navbar />
      <div className="pt-16">
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<Page><Home /></Page>} />
            <Route path="/portfolio" element={<Page><Portafolio /></Page>} />
            <Route path="/about" element={<Page><About /></Page>} />
            <Route path="/services" element={<Page><Services /></Page>} />
            <Route path="/services/:key" element={<Page><ServiceDetail /></Page>} />
            <Route path="/contact" element={<Page><Contact /></Page>} />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </>
  )
}

export default function App() {
  return <AppInner />
}
