"use client"
import React, { useState, useEffect, useRef, ReactNode } from "react"
import { motion, AnimatePresence } from "motion/react"

const LogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="nodeGradientC" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#B8F2FF" />
        <stop offset="55%" stopColor="#78D9FF" />
        <stop offset="100%" stopColor="#59C8FF" />
      </radialGradient>
      <filter id="glowC" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g
      filter="url(#glowC)"
      stroke="url(#nodeGradientC)"
      strokeWidth="18"
      strokeLinecap="round"
      opacity="0.6"
    >
      <line x1="256" y1="256" x2="256" y2="145" />
      <line x1="256" y1="256" x2="356" y2="200" />
      <line x1="256" y1="256" x2="356" y2="312" />
      <line x1="256" y1="256" x2="256" y2="367" />
      <line x1="256" y1="256" x2="156" y2="312" />
      <line x1="256" y1="256" x2="156" y2="200" />
    </g>
    <g
      filter="url(#glowC)"
      stroke="url(#nodeGradientC)"
      strokeWidth="18"
      strokeLinecap="round"
      opacity="0.6"
    >
      <line x1="256" y1="145" x2="356" y2="200" />
      <line x1="356" y1="200" x2="356" y2="312" />
      <line x1="356" y1="312" x2="256" y2="367" />
      <line x1="256" y1="367" x2="156" y2="312" />
      <line x1="156" y1="312" x2="156" y2="200" />
      <line x1="156" y1="200" x2="256" y2="145" />
    </g>
    <circle cx="256" cy="256" r="42" fill="url(#nodeGradientC)" filter="url(#glowC)" />
    <circle cx="256" cy="125" r="28" fill="url(#nodeGradientC)" filter="url(#glowC)" />
    <circle cx="380" cy="190" r="28" fill="url(#nodeGradientC)" filter="url(#glowC)" />
    <circle cx="380" cy="322" r="28" fill="url(#nodeGradientC)" filter="url(#glowC)" />
    <circle cx="256" cy="387" r="28" fill="url(#nodeGradientC)" filter="url(#glowC)" />
    <circle cx="132" cy="322" r="28" fill="url(#nodeGradientC)" filter="url(#glowC)" />
    <circle cx="132" cy="190" r="28" fill="url(#nodeGradientC)" filter="url(#glowC)" />
  </svg>
)

interface TextCursorProps {
  text?: ReactNode
  children?: ReactNode
  spacing?: number
  followMouseDirection?: boolean
  randomFloat?: boolean
  exitDuration?: number
  removalInterval?: number
  maxPoints?: number
}

interface TrailItem {
  id: number
  x: number
  y: number
  angle: number
  randomX?: number
  randomY?: number
  randomRotate?: number
}

const TextCursor: React.FC<TextCursorProps> = ({
  text = <LogoIcon />,
  children,
  spacing = 100,
  followMouseDirection = true,
  randomFloat = true,
  exitDuration = 0.5,
  removalInterval = 30,
  maxPoints = 5,
}) => {
  const [trail, setTrail] = useState<TrailItem[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const lastMoveTimeRef = useRef<number>(Date.now())
  const idCounter = useRef<number>(0)

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    setTrail((prev) => {
      let newTrail = [...prev]
      if (newTrail.length === 0) {
        newTrail.push({
          id: idCounter.current++,
          x: mouseX,
          y: mouseY,
          angle: 0,
          ...(randomFloat && {
            randomX: Math.random() * 10 - 5,
            randomY: Math.random() * 10 - 5,
            randomRotate: Math.random() * 10 - 5,
          }),
        })
      } else {
        const last = newTrail[newTrail.length - 1]
        const dx = mouseX - last.x
        const dy = mouseY - last.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance >= spacing) {
          let rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI

          rawAngle = ((rawAngle + 180) % 360) - 180

          const computedAngle = followMouseDirection ? rawAngle : 0
          const steps = Math.floor(distance / spacing)
          for (let i = 1; i <= steps; i++) {
            const t = (spacing * i) / distance
            const newX = last.x + dx * t
            const newY = last.y + dy * t
            newTrail.push({
              id: idCounter.current++,
              x: newX,
              y: newY,
              angle: computedAngle,
              ...(randomFloat && {
                randomX: Math.random() * 10 - 5,
                randomY: Math.random() * 10 - 5,
                randomRotate: Math.random() * 10 - 5,
              }),
            })
          }
        }
      }
      if (newTrail.length > maxPoints) {
        newTrail = newTrail.slice(newTrail.length - maxPoints)
      }
      return newTrail
    })
    lastMoveTimeRef.current = Date.now()
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("mousemove", handleMouseMove)
    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [containerRef.current])

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMoveTimeRef.current > 100) {
        setTrail((prev) => (prev.length > 0 ? prev.slice(1) : prev))
      }
    }, removalInterval)
    return () => clearInterval(interval)
  }, [removalInterval])

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {children}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {trail.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 1, rotate: item.angle }}
              animate={{
                opacity: 1,
                scale: 1,
                x: randomFloat ? [0, item.randomX || 0, 0] : 0,
                y: randomFloat ? [0, item.randomY || 0, 0] : 0,
                rotate: randomFloat
                  ? [item.angle, item.angle + (item.randomRotate || 0), item.angle]
                  : item.angle,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                opacity: { duration: exitDuration, ease: "easeOut" },

                ...(randomFloat && {
                  x: {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                  y: {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                  rotate: {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                }),
              }}
              className="absolute select-none pointer-events-none"
              style={{ left: item.x, top: item.y }}
            >
              {text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TextCursor
