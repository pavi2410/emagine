import { useEffect, useRef, useState } from 'react'
import { useStore } from '@nanostores/react'
import { Box, Flex, Spinner, Text } from '@radix-ui/themes'
import { streaming } from '../../stores/streaming'
import { apps } from '../../stores/desktop'

interface ProgressiveContentProps {
  appId: string
}

/**
 * Progressive HTML rendering component
 * Displays streamed HTML chunks in real-time
 */
export function ProgressiveContent({ appId }: ProgressiveContentProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const $streaming = useStore(streaming)
  const $apps = useStore(apps)

  const app = $apps.find(a => a.id === appId)

  useEffect(() => {
    // Update iframe when HTML is updated
    if (app?.html && iframeRef.current) {
      const iframe = iframeRef.current

      try {
        // Set HTML in iframe
        const doc = iframe.contentDocument || iframe.contentWindow?.document

        if (doc) {
          doc.open()
          doc.write(app.html)
          doc.close()

          // Detect load completion
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Failed to update iframe:', error)
      }
    }
  }, [app?.html, appId])

  // Display during streaming
  const isStreamingThisApp = $streaming.html.targetAppId === appId && $streaming.html.chunks.length > 0

  if (!app) {
    return (
      <Flex align="center" justify="center" style={{ height: '100%' }}>
        <Text size="2" color="gray">
          App not found
        </Text>
      </Flex>
    )
  }

  return (
    <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Loading overlay */}
      {(isLoading || isStreamingThisApp) && (
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
            pointerEvents: 'none'
          }}
        >
          <Spinner size="3" />
          <Text size="2" color="gray">
            {isStreamingThisApp ? 'Streaming content...' : 'Loading...'}
          </Text>
          {isStreamingThisApp && (
            <Text size="1" color="gray">
              {$streaming.html.chunks.length} chunks received
            </Text>
          )}
        </Flex>
      )}

      {/* iframe for app content */}
      <iframe
        ref={iframeRef}
        title={app.name}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          background: 'white'
        }}
        sandbox="allow-scripts allow-same-origin"
      />
    </Box>
  )
}
