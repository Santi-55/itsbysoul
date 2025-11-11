import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const [visible, setVisible] = useState(true)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)

  const sx = useSpring(x, { stiffness: 300, damping: 30 })
  const sy = useSpring(y, { stiffness: 300, damping: 30 })
  const sscale = useSpring(scale, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const show = () => setVisible(true)
    const hide = () => setVisible(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseenter', show)
    window.addEventListener('mouseleave', hide)

    const enterMagnetic = () => scale.set(1.8)
    const leaveMagnetic = () => scale.set(1)

    document.addEventListener('mouseover', (e) => {
      const t = e.target as HTMLElement
      if (t?.closest('[data-magnetic]')) enterMagnetic()
    })
    document.addEventListener('mouseout', (e) => {
      const t = e.target as HTMLElement
      if (t?.closest('[data-magnetic]')) leaveMagnetic()
    })

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseenter', show)
      window.removeEventListener('mouseleave', hide)
    }
  }, [])

  if (!visible) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
      style={{ translateX: sx, translateY: sy }}
    >
      <motion.div
        className="h-4 w-4 rounded-full bg-white"
        style={{ scale: sscale }}
      />
    </motion.div>
  )
}
