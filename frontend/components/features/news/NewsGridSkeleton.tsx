import { motion } from "motion/react"
import NewsCardSkeleton from "./NewsCardSkeleton"

export default function NewsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <NewsCardSkeleton />
        </motion.div>
      ))}
    </div>
  )
}
