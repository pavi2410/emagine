import { Box, Flex, Text, Progress } from '@radix-ui/themes'
import { useStore } from '@nanostores/react'
import { generation } from '../../stores/generation'

export function GenerationStatus() {
  const $generation = useStore(generation)

  return (
    <Box className="bg-slate-800/90 rounded-lg p-3 backdrop-blur-md">
      <Flex direction="column" gap="2">
        <Flex justify="between" align="center">
          <Text size="2" weight="medium" className="text-purple-300">
            {$generation.currentStep}
          </Text>
          <Text size="1" className="text-slate-400">
            {$generation.progress}%
          </Text>
        </Flex>
        <Progress value={$generation.progress} max={100} />
      </Flex>
    </Box>
  )
}
