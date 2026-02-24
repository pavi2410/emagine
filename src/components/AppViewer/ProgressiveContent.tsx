import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Spinner } from '../ui/Spinner'
import { appsQueryOptions, getAppUrl, useRegenerateApp, subscribeToAppUpdates } from '../../queries/apps'
import { AVAILABLE_MODELS, type ModelId } from '../../queries/settings'

interface ProgressiveContentProps {
  appId: string
}

/**
 * Progressive HTML rendering component
 * Loads app from server URL via iframe src
 */
export function ProgressiveContent({ appId }: ProgressiveContentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [selectedModel, setSelectedModel] = useState<ModelId | ''>('')
  const { data: apps = [] } = useQuery(appsQueryOptions)
  const regenerateApp = useRegenerateApp()
  const queryClient = useQueryClient()

  const app = apps.find((a) => a.id === appId)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const handleRetry = async () => {
    if (!app) return
    
    try {
      setHasError(false)
      await regenerateApp.mutateAsync({ appId, prompt: app.prompt })
      
      // Subscribe to updates for the regenerating app
      subscribeToAppUpdates(appId, queryClient)
    } catch (err) {
      console.error('Retry failed:', err)
    }
  }

  const handleRetryWithModel = async () => {
    if (!app || !selectedModel) return
    
    try {
      setHasError(false)
      // Update app's model in the request - need to use a different endpoint or include model
      const res = await fetch(`/api/apps/${appId}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ prompt: app.prompt, model: selectedModel }),
      })
      
      if (!res.ok) {
        throw new Error('Regeneration failed')
      }
      
      // Update app status locally
      queryClient.setQueryData(['apps'], (old: typeof apps) =>
        old?.map((a) => a.id === appId ? { ...a, status: 'generating' as const, modelUsed: selectedModel } : a)
      )
      
      // Subscribe to updates
      subscribeToAppUpdates(appId, queryClient)
    } catch (err) {
      console.error('Retry with model failed:', err)
    }
  }

  if (!app) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-sm text-slate-500">
          App not found
        </span>
      </div>
    )
  }

  // Show loading state for generating apps
  if (app.status === 'generating') {
    return (
      <div className="flex items-center justify-center flex-col gap-3 h-full">
        <Spinner size="3" />
        <span className="text-sm text-slate-500">
          Generating app...
        </span>
      </div>
    )
  }

  // Show error state with retry options
  if (app.status === 'error' || hasError) {
    const errorMessage = app.errorMessage || (hasError ? 'Failed to load app content' : 'Generation failed')
    const currentModel = app.modelUsed ? AVAILABLE_MODELS[app.modelUsed as ModelId] : null
    
    return (
      <div className="flex items-center justify-center flex-col gap-4 h-full p-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span className="text-base font-medium text-red-400">
            Generation Failed
          </span>
        </div>
        
        <div className="bg-slate-800/80 rounded-lg p-3 max-w-md text-center">
          <span className="text-sm text-slate-300 wrap-break-word">
            {errorMessage}
          </span>
          {currentModel && (
            <span className="text-xs text-slate-500 block mt-1">
              Model used: {currentModel.name}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={handleRetry}
            disabled={regenerateApp.isPending}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {regenerateApp.isPending ? (
              <>
                <Spinner size="1" />
                Retrying...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </>
            )}
          </button>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-slate-500 text-center">Or try with a different model:</span>
            <div className="flex gap-2">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as ModelId)}
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select model...</option>
                {Object.entries(AVAILABLE_MODELS).map(([id, model]) => (
                  <option key={id} value={id} disabled={id === app.modelUsed}>
                    {model.name} {id === app.modelUsed ? '(current)' : ''}
                  </option>
                ))}
              </select>
              <button
                onClick={handleRetryWithModel}
                disabled={!selectedModel || regenerateApp.isPending}
                className="px-3 py-2 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Load app from server URL
  return (
    <div className="relative w-full h-full">
      {/* Loading overlay */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 pointer-events-none flex items-center justify-center flex-col gap-3"
        >
          <Spinner size="3" />
          <span className="text-sm text-slate-400">
            Loading app...
          </span>
        </div>
      )}

      {/* iframe loads app from server URL */}
      <iframe
        src={getAppUrl(appId)}
        title={app.name}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          background: 'white',
        }}
        sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
      />
    </div>
  )
}
