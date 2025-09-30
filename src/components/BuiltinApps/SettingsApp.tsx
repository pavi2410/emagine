import { Box, Flex, Text } from '@radix-ui/themes'

export function SettingsApp() {
  return (
    <Box className="p-6 h-full overflow-auto bg-slate-900">
      <Text size="6" weight="bold" className="mb-6 block">
        ⚙️ Settings
      </Text>

      {/* API Configuration */}
      <Box className="bg-slate-800 rounded-lg p-5 mb-4">
        <Text size="4" weight="medium" className="mb-3 block text-slate-300">
          API Configuration
        </Text>

        <Flex justify="between" align="center" className="py-3 border-b border-slate-700">
          <Box>
            <Text size="3" className="block">Bring Your Own Key (BYOK)</Text>
          </Box>
          <Box className="bg-orange-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
            TODO
          </Box>
        </Flex>

        <Flex justify="between" align="center" className="py-3">
          <Box>
            <Text size="3" className="block">OpenRouter API Key</Text>
            <Text size="2" className="text-slate-400 mt-1 block">
              Configure your own API key (Coming soon)
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Appearance */}
      <Box className="bg-slate-800 rounded-lg p-5 mb-4">
        <Text size="4" weight="medium" className="mb-3 block text-slate-300">
          Appearance
        </Text>

        <Flex justify="between" align="center" className="py-3 border-b border-slate-700">
          <Text size="3">Theme</Text>
          <Text size="3" className="text-slate-400">Dark (default)</Text>
        </Flex>

        <Flex justify="between" align="center" className="py-3">
          <Text size="3">Wallpaper</Text>
          <Text size="3" className="text-slate-400">Nature (random)</Text>
        </Flex>
      </Box>

      {/* About */}
      <Box className="bg-slate-800 rounded-lg p-5">
        <Text size="4" weight="medium" className="mb-3 block text-slate-300">
          About
        </Text>

        <Flex justify="between" align="center" className="py-3 border-b border-slate-700">
          <Text size="3">Version</Text>
          <Text size="3" className="text-slate-400">v1.0</Text>
        </Flex>

        <Flex justify="between" align="center" className="py-3">
          <Text size="3">Powered by</Text>
          <Text size="3" className="text-slate-400">Grok 4 Fast (OpenRouter)</Text>
        </Flex>
      </Box>
    </Box>
  )
}
