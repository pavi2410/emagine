import { Dialog } from '@base-ui/react/dialog'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'
import { type App, useUpdateApp } from '../../queries/apps'

interface RenameAppModalProps {
  app: App | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😋', '😎', '🤩', '🥳', '😏', '🤔'],
  'Objects': ['📱', '💻', '🖥️', '⌨️', '🖱️', '💾', '📀', '📷', '🎥', '📺', '📻', '⏰', '🔋', '💡', '🔦', '📡', '🧭', '⏱️', '📞', '☎️'],
  'Tools': ['🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🗜️', '⚖️', '🔗', '⛓️', '🧰', '🧲', '🔬', '🔭', '📐', '📏', '✂️', '📌', '📍'],
  'Nature': ['🌸', '🌺', '🌻', '🌹', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🍀', '🍁', '🍂', '🍃', '🌿', '☘️', '🌾', '🌈', '☀️', '🌙'],
  'Food': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🍕', '🍔', '🍟', '🌮'],
  'Activities': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🎯', '🎮', '🎲', '🧩', '🎨', '🎬', '🎤', '🎧'],
  'Travel': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '✈️', '🚀', '🛸', '🚁', '⛵', '🚤', '🛥️', '🏠', '🏢', '🏭', '🗼'],
  'Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💯', '✅', '❌', '⭐', '🔥', '💥', '💫', '🎉', '🎊', '💎', '🔔', '📢'],
}

export function RenameAppModal({ app, open, onOpenChange }: RenameAppModalProps) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof EMOJI_CATEGORIES>('Objects')
  const updateApp = useUpdateApp()

  useEffect(() => {
    if (open && app) {
      setName(app.name)
      setIcon(app.icon)
    }
  }, [open, app])

  const handleSave = async () => {
    if (!app || !name.trim()) return

    try {
      await updateApp.mutateAsync({
        appId: app.id,
        name: name.trim(),
        icon: icon || app.icon,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  const hasChanges = app && (name !== app.name || icon !== app.icon)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && app && (
          <Dialog.Portal keepMounted>
            <Dialog.Backdrop
              render={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              }
              className="fixed inset-0 bg-black/40 z-9999"
            />
            <div className="fixed inset-0 z-10000 flex items-center justify-center pointer-events-none">
              <Dialog.Popup
                render={
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                }
                className="pointer-events-auto w-[320px] bg-[#2a2a2c]/95 backdrop-blur-2xl rounded-xl shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)] overflow-hidden"
              >
              {/* Header - macOS style */}
              <div className="flex items-center justify-center py-3 px-4 border-b border-white/10 relative">
                <Dialog.Close
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors"
                  aria-label="Close"
                />
                <Dialog.Title className="text-[13px] font-medium text-white/90">
                  Rename App
                </Dialog.Title>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-3">
                {/* Preview */}
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-3xl">{icon || app.icon}</span>
                  <span className="text-[13px] font-medium text-white/90 truncate">
                    {name || 'App Name'}
                  </span>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-[11px] font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter app name..."
                    className="w-full px-3 py-1.5 bg-black/30 border border-white/10 rounded-md text-[13px] text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    autoFocus
                  />
                </div>

                {/* Emoji Picker */}
                <div>
                  <label className="block text-[11px] font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                    Icon
                  </label>
                  
                  {/* Category Tabs */}
                  <div className="flex gap-0.5 mb-2 overflow-x-auto">
                    {Object.keys(EMOJI_CATEGORIES).map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category as keyof typeof EMOJI_CATEGORIES)}
                        className={`px-2 py-1 text-[11px] rounded whitespace-nowrap transition-colors ${
                          selectedCategory === category
                            ? 'bg-white/20 text-white'
                            : 'text-white/50 hover:text-white/80'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Emoji Grid */}
                  <div className="grid grid-cols-8 gap-0.5 p-2 bg-black/20 rounded-lg max-h-24 overflow-y-auto">
                    {EMOJI_CATEGORIES[selectedCategory].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setIcon(emoji)}
                        className={`w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-lg ${
                          icon === emoji ? 'bg-blue-500/40 ring-1 ring-blue-400' : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions - macOS style buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onOpenChange(false)}
                    className="flex-1 py-1.5 px-4 bg-white/10 hover:bg-white/15 text-[13px] text-white/90 font-medium rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!name.trim() || !hasChanges || updateApp.isPending}
                    className="flex-1 py-1.5 px-4 bg-blue-500 hover:bg-blue-400 disabled:bg-white/10 disabled:text-white/30 text-[13px] text-white font-medium rounded-md transition-colors"
                  >
                    {updateApp.isPending ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </Dialog.Popup>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
