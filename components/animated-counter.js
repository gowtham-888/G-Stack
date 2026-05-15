'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView, motion, useMotionValue, useTransform, animate } from 'framer-motion'

export default function AnimatedCounter({ to = 100, duration = 2, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (v) => v.toFixed(decimals))
  const [val, setVal] = useState('0')

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, to, { duration, ease: 'easeOut' })
    const unsub = rounded.on('change', (v) => setVal(v))
    return () => { controls.stop(); unsub() }
  }, [inView, to])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{val}{suffix}
    </span>
  )
}
