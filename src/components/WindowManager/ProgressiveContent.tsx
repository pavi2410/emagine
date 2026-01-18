import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '../ui/Spinner'
import { appsQueryOptions, getAppUrl } from '../../queries/apps'

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
  const { data: apps = [] } = useQuery(appsQueryOptions)

  const app = apps.find((a) => a.id === appId)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
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

  // Show error state
  if (app.status === 'error' || hasError) {
    return (
      <div className="flex items-center justify-center flex-col gap-2 h-full">
        <span className="text-sm text-red-500">
          Failed to load app
        </span>
        <span className="text-xs text-slate-500">
          Please try regenerating
        </span>
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
