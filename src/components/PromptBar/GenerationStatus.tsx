import { Box, Flex, Text, Progress } from '@radix-ui/themes'
import { useStore } from '@nanostores/react'
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
    <Box className="bg-slate-800/90 rounded-lg p-3 backdrop-blur-md">
      <Flex direction="column" gap="2">
        {/* Current progress */}
        <Flex justify="between" align="center">
          <Text size="2" weight="medium" className="text-purple-300">
            {currentMessage}
          </Text>
          <Text size="1" className="text-slate-400">
            {currentProgress}%
          </Text>
        </Flex>

        <Progress value={currentProgress} max={100} />

        {/* Recent progress deltas */}
        {recentDeltas.length > 0 && (
          <Flex direction="column" gap="1" className="mt-1">
            {recentDeltas.map((delta, index) => (
              <Flex key={delta.timestamp} align="center" gap="2">
                <Box
                  className={`w-1 h-1 rounded-full ${
                    index === recentDeltas.length - 1
                      ? 'bg-purple-400'
                      : 'bg-slate-600'
                  }`}
                />
                <Text
                  size="1"
                  className={`${
                    index === recentDeltas.length - 1
                      ? 'text-purple-300'
                      : 'text-slate-500'
                  }`}
                >
                  {delta.message} ({delta.progress}%)
                </Text>
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>
    </Box>
  )
}
