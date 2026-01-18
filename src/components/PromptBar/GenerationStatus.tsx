import { useStore } from '@nanostores/react'
import { Progress } from '../ui/Progress'
import { generation } from '../../stores/generation'
import { streaming } from '../../stores/streaming'

/**
 * Component to display generation progress in real-time
 * Prioritizes streaming progress deltas
 */
export function GenerationStatus() {
  const $generation = useStore(generation)
  const $streaming = useStore(streaming)

  // Prioritize streaming progress, fallback to legacy progress
  const currentProgress = $streaming.progress.current > 0
    ? $streaming.progress.current
    : $generation.progress

  const currentMessage = $streaming.progress.message ||
                        $generation.currentStep

  // Latest progress deltas (last 3)
  const recentDeltas = $streaming.progress.deltas.slice(-3)

  if (!currentMessage && recentDeltas.length === 0) {
    return null
  }

  return (
    <div className="bg-slate-800/90 rounded-lg p-3 backdrop-blur-md">
      <div className="flex flex-col gap-2">
        {/* Current progress */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-purple-300">
            {currentMessage}
          </span>
          <span className="text-xs text-slate-400">
            {currentProgress}%
          </span>
        </div>

        <Progress value={currentProgress} max={100} />

        {/* Recent progress deltas */}
        {recentDeltas.length > 0 && (
          <div className="flex flex-col gap-1 mt-1">
            {recentDeltas.map((delta, index) => (
              <div key={delta.timestamp} className="flex items-center gap-2">
                <div
                  className={`w-1 h-1 rounded-full ${
                    index === recentDeltas.length - 1
                      ? 'bg-purple-400'
                      : 'bg-slate-600'
                  }`}
                />
                <span
                  className={`text-xs ${
                    index === recentDeltas.length - 1
                      ? 'text-purple-300'
                      : 'text-slate-500'
                  }`}
                >
                  {delta.message} ({delta.progress}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
