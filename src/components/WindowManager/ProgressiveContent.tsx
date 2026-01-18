import { useState } from 'react'
import { useStore } from '@nanostores/react'
import { Box, Flex, Spinner, Text } from '@radix-ui/themes'
import { apps } from '../../stores/workspace'
import { api } from '../../lib/api'

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
  const $apps = useStore(apps)

  const app = $apps.find((a) => a.id === appId)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (!app) {
    return (
      <Flex align="center" justify="center" style={{ height: '100%' }}>
        <Text size="2" color="gray">
          App not found
        </Text>
      </Flex>
    )
  }

  // Show loading state for generating apps
  if (app.status === 'generating') {
    return (
      <Flex align="center" justify="center" direction="column" gap="3" style={{ height: '100%' }}>
        <Spinner size="3" />
        <Text size="2" color="gray">
          Generating app...
        </Text>
      </Flex>
    )
  }

  // Show error state
  if (app.status === 'error' || hasError) {
    return (
      <Flex align="center" justify="center" direction="column" gap="2" style={{ height: '100%' }}>
        <Text size="2" color="red">
          Failed to load app
        </Text>
        <Text size="1" color="gray">
          Please try regenerating
        </Text>
      </Flex>
    )
  }

  // Load app from server URL
  return (
    <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Loading overlay */}
      {isLoading && (
        <Flex
          align="center"
          justify="center"
          direction="column"
          gap="3"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <Spinner size="3" />
          <Text size="2" color="gray">
            Loading app...
          </Text>
        </Flex>
      )}

      {/* iframe loads app from server URL */}
      <iframe
        src={api.getAppUrl(appId)}
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
    </Box>
  )
}
