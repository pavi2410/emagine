import { Box, Flex, Text } from '@radix-ui/themes'
import { useStore } from '@nanostores/react'
import { generation } from '../../stores/generation'

export function AIReasoning() {
  const $generation = useStore(generation)

  if (!$generation.isGenerating && !$generation.currentStep) {
    return null
  }

  return (
    <Box className="bg-slate-800/90 backdrop-blur-md rounded-lg p-4 shadow-lg border border-slate-700">
      <Flex direction="column" gap="2">
        <Flex align="center" gap="2">
          <span className="text-lg">🤔</span>
          <Text size="2" weight="medium" className="text-slate-300">
            AI Reasoning
          </Text>
        </Flex>

        <Text size="2" className="text-slate-400 leading-relaxed">
          {$generation.currentStep}
        </Text>

        {$generation.isGenerating && (
          <Flex align="center" gap="2">
            <Text size="1" className="text-slate-500">
              Progress: {$generation.progress}%
            </Text>
          </Flex>
        )}
      </Flex>
    </Box>
  )
}
