import { Box, Flex, Text } from '@radix-ui/themes'

export function AboutSection() {
  return (
    <Box className="p-6">
      <Text size="5" weight="bold" className="mb-6 block text-white">
        About
      </Text>

      {/* App Info */}
      <Box className="bg-slate-800/50 rounded-xl p-6 mb-4">
        <Flex direction="column" align="center" className="py-4">
          <Box className="text-5xl mb-3">✨</Box>
          <Text size="6" weight="bold" className="text-white mb-1">
            emagine
          </Text>
          <Text size="2" className="text-slate-400 mb-4">
            Version 1.0
          </Text>
          <Text size="2" className="text-slate-300 text-center max-w-sm">
            AI-powered app generation platform. Describe what you want, and watch it come to life.
          </Text>
        </Flex>
      </Box>

      {/* Technical Info */}
      <Box className="bg-slate-800/50 rounded-xl p-5 mb-4">
        <Text size="3" weight="medium" className="mb-4 block text-slate-300">
          Technical Details
        </Text>

        <Flex direction="column" gap="2">
          <Flex justify="between" align="center" className="py-2 border-b border-slate-700/50">
            <Text size="2" className="text-slate-400">Powered by</Text>
            <Text size="2" className="text-white">OpenRouter</Text>
          </Flex>
          <Flex justify="between" align="center" className="py-2 border-b border-slate-700/50">
            <Text size="2" className="text-slate-400">Framework</Text>
            <Text size="2" className="text-white">React + TanStack</Text>
          </Flex>
          <Flex justify="between" align="center" className="py-2 border-b border-slate-700/50">
            <Text size="2" className="text-slate-400">UI Library</Text>
            <Text size="2" className="text-white">Radix UI</Text>
          </Flex>
          <Flex justify="between" align="center" className="py-2">
            <Text size="2" className="text-slate-400">Runtime</Text>
            <Text size="2" className="text-white">Bun</Text>
          </Flex>
        </Flex>
      </Box>

      {/* Credits */}
      <Box className="bg-slate-800/50 rounded-xl p-5">
        <Text size="3" weight="medium" className="mb-4 block text-slate-300">
          Credits
        </Text>

        <Flex direction="column" gap="2">
          <Text size="2" className="text-slate-400">
            Built with love using modern web technologies.
          </Text>
          <Text size="2" className="text-slate-500">
            © 2025 emagine. All rights reserved.
          </Text>
        </Flex>
      </Box>
    </Box>
  )
}
