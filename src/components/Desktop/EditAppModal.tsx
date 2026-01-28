import { Dialog } from '@base-ui/react/dialog'
import { IconRefresh, IconHistory, IconCheck } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type App,
  useRegenerateApp,
  subscribeToAppUpdates,
  appVersionsQueryOptions,
  useRestoreVersion,
} from '../../queries/apps'

interface EditAppModalProps {
  app: App | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAppModal({ app, open, onOpenChange }: EditAppModalProps) {
  const [prompt, setPrompt] = useState('')
  const [showVersions, setShowVersions] = useState(false)
  const regenerateApp = useRegenerateApp()
  const restoreVersion = useRestoreVersion()
  const queryClient = useQueryClient()

  const { data: versionsData } = useQuery({
    ...appVersionsQueryOptions(app?.id ?? ''),
    enabled: open && !!app?.id && showVersions,
  })

  // Reset state when app changes
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && app) {
      setPrompt(app.prompt || '')
      setShowVersions(false)
    }
    onOpenChange(newOpen)
  }

  const handleRegenerate = async () => {
    if (!app || !prompt.trim()) return

    try {
      await regenerateApp.mutateAsync({
        appId: app.id,
        prompt: prompt.trim(),
      })

      // Subscribe to updates
      subscribeToAppUpdates(app.id, queryClient, () => {
        // Invalidate versions after regeneration
        queryClient.invalidateQueries({ queryKey: ['app-versions', app.id] })
      })

      onOpenChange(false)
    } catch (error) {
      console.error('Regeneration failed:', error)
    }
  }

  const handleRestoreVersion = async (versionId: string) => {
    if (!app) return

    try {
      await restoreVersion.mutateAsync({
        appId: app.id,
        versionId,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Restore failed:', error)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
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
                className="pointer-events-auto w-[400px] max-h-[70vh] bg-[#2a2a2c]/95 backdrop-blur-2xl rounded-xl shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)] overflow-hidden flex flex-col"
              >
              {/* Header - macOS style */}
              <div className="flex items-center justify-center py-3 px-4 border-b border-white/10 relative">
                <Dialog.Close
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors"
                  aria-label="Close"
                />
                <div className="flex items-center gap-2">
                  <span className="text-lg">{app.icon}</span>
                  <Dialog.Title className="text-[13px] font-medium text-white/90">
                    {app.name}
                  </Dialog.Title>
                </div>
              </div>

              {/* Tab buttons */}
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setShowVersions(false)}
                  className={`flex-1 px-4 py-2 text-[12px] font-medium transition-colors ${
                    !showVersions
                      ? 'text-white bg-white/10'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <IconRefresh className="w-3.5 h-3.5 inline mr-1.5" />
                  Edit & Regenerate
                </button>
                <button
                  onClick={() => setShowVersions(true)}
                  className={`flex-1 px-4 py-2 text-[12px] font-medium transition-colors ${
                    showVersions
                      ? 'text-white bg-white/10'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <IconHistory className="w-3.5 h-3.5 inline mr-1.5" />
                  Version History
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {!showVersions ? (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                        Prompt
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe what you want to build..."
                        className="w-full h-28 px-3 py-2 bg-black/30 border border-white/10 rounded-md text-[13px] text-white placeholder-white/30 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                      />
                    </div>

                    <button
                      onClick={handleRegenerate}
                      disabled={!prompt.trim() || regenerateApp.isPending}
                      className="w-full py-1.5 px-4 bg-blue-500 hover:bg-blue-400 disabled:bg-white/10 disabled:text-white/30 text-[13px] text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <IconRefresh className={`w-3.5 h-3.5 ${regenerateApp.isPending ? 'animate-spin' : ''}`} />
                      {regenerateApp.isPending ? 'Regenerating...' : 'Regenerate App'}
                    </button>

                    {app.modelUsed && (
                      <p className="text-[11px] text-white/40 text-center">
                        Model: {app.modelUsed}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {versionsData?.versions.length === 0 && (
                      <p className="text-white/50 text-center py-6 text-[13px]">
                        No version history available
                      </p>
                    )}
                    {versionsData?.versions.map((version) => (
                      <div
                        key={version.id}
                        className={`p-2.5 rounded-lg transition-colors ${
                          version.isCurrent
                            ? 'bg-blue-500/20'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[13px] font-medium text-white/90">
                            Version {version.version}
                            {version.isCurrent && (
                              <span className="ml-2 text-[11px] text-blue-400">
                                <IconCheck className="w-3 h-3 inline" /> Current
                              </span>
                            )}
                          </span>
                          {!version.isCurrent && (
                            <button
                              onClick={() => handleRestoreVersion(version.id)}
                              disabled={restoreVersion.isPending}
                              className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              Restore
                            </button>
                          )}
                        </div>
                        <p className="text-[12px] text-white/50 line-clamp-2">
                          {version.prompt || 'No prompt recorded'}
                        </p>
                        <p className="text-[11px] text-white/30 mt-1">
                          {new Date(version.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Dialog.Popup>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
