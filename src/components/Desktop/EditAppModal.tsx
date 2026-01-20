import { Dialog } from '@base-ui/react/dialog'
import { IconX, IconRefresh, IconHistory, IconCheck } from '@tabler/icons-react'
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            />
            <Dialog.Popup
              render={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: '-48%', x: '-50%' }}
                  animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                  exit={{ opacity: 0, scale: 0.95, y: '-48%', x: '-50%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              }
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-[480px] max-h-[80vh] bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-slate-700/50">
                <span className="text-2xl">{app.icon}</span>
                <div className="flex-1">
                  <Dialog.Title className="text-lg font-semibold text-white">
                    {app.name}
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-slate-400">
                    Edit prompt and regenerate
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  className="w-8 h-8 rounded-full bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <IconX className="w-4 h-4 text-slate-400" />
                </Dialog.Close>
              </div>

              {/* Tab buttons */}
              <div className="flex border-b border-slate-700/50">
                <button
                  onClick={() => setShowVersions(false)}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                    !showVersions
                      ? 'text-white border-b-2 border-blue-500'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <IconRefresh className="w-4 h-4 inline mr-2" />
                  Edit & Regenerate
                </button>
                <button
                  onClick={() => setShowVersions(true)}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                    showVersions
                      ? 'text-white border-b-2 border-blue-500'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <IconHistory className="w-4 h-4 inline mr-2" />
                  Version History
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {!showVersions ? (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Prompt
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe what you want to build..."
                        className="w-full h-32 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>

                    <button
                      onClick={handleRegenerate}
                      disabled={!prompt.trim() || regenerateApp.isPending}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <IconRefresh className={`w-4 h-4 ${regenerateApp.isPending ? 'animate-spin' : ''}`} />
                      {regenerateApp.isPending ? 'Regenerating...' : 'Regenerate App'}
                    </button>

                    {app.modelUsed && (
                      <p className="text-xs text-slate-500 text-center">
                        Using model: {app.modelUsed}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {versionsData?.versions.length === 0 && (
                      <p className="text-slate-400 text-center py-8">
                        No version history available
                      </p>
                    )}
                    {versionsData?.versions.map((version) => (
                      <div
                        key={version.id}
                        className={`p-3 rounded-lg border transition-colors ${
                          version.isCurrent
                            ? 'bg-blue-900/30 border-blue-500/50'
                            : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-white">
                            Version {version.version}
                            {version.isCurrent && (
                              <span className="ml-2 text-xs text-blue-400">
                                <IconCheck className="w-3 h-3 inline" /> Current
                              </span>
                            )}
                          </span>
                          {!version.isCurrent && (
                            <button
                              onClick={() => handleRestoreVersion(version.id)}
                              disabled={restoreVersion.isPending}
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              Restore
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2">
                          {version.prompt || 'No prompt recorded'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(version.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
