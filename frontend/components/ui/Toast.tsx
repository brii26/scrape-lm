"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

export type ToastType = "error" | "warning" | "info"

interface Props {
  message: string
  type?: ToastType
  onDismiss: () => void
  duration?: number
}

const styles: Record<ToastType, string> = {
  error:   "bg-red-500/10 border-red-500/30 text-red-400",
  warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  info:    "bg-sky-500/10 border-sky-500/30 text-sky-400",
}

export default function Toast({ message, type = "error", onDismiss, duration = 3500 }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration)
    return () => clearTimeout(t)
  }, [onDismiss, duration])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium backdrop-blur-sm ${styles[type]}`}
    >
      {message}
      <button onClick={onDismiss} className="ml-auto opacity-60 hover:opacity-100 transition-opacity">✕</button>
    </motion.div>
  )
}
