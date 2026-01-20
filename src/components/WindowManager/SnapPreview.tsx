import { useStore } from '@nanostores/react'
import { motion, AnimatePresence } from 'motion/react'
import { activeSnapPreview, getSnapDimensions } from '../../stores/windows'

export function SnapPreview() {
  const zone = useStore(activeSnapPreview)
  const dims = zone ? getSnapDimensions(zone) : null

  return (
    <AnimatePresence>
      {zone && dims && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed pointer-events-none z-[999] rounded-xl border-2 border-blue-500/50 bg-blue-500/20 backdrop-blur-sm"
          style={{
            left: dims.x,
            top: dims.y,
            width: dims.width,
            height: dims.height,
          }}
        />
      )}
    </AnimatePresence>
  )
}
