import { Box, Flex, Text, Select } from '@radix-ui/themes'
import { useStore } from '@nanostores/react'
import { settings, setSelectedModel, AVAILABLE_MODELS, type ModelId } from '../../stores/settings'

export function SettingsApp() {
  const $settings = useStore(settings)

  return (
    <Box className="p-6 h-full overflow-auto bg-slate-900">
      <Text size="6" weight="bold" className="mb-6 block">
        ⚙️ Settings
      </Text>

      {/* Model Configuration */}
      <Box className="bg-slate-800 rounded-lg p-5 mb-4">
        <Text size="4" weight="medium" className="mb-3 block text-slate-300">
          AI Model
        </Text>

        <Flex direction="column" gap="3">
          <Box>
            <Text size="2" className="text-slate-400 mb-2 block">
              Select Model
            </Text>
            <Select.Root
              value={$settings.selectedModel}
              onValueChange={(value) => setSelectedModel(value as ModelId)}
            >
              <Select.Trigger className="w-full" />
              <Select.Content>
                {Object.entries(AVAILABLE_MODELS).map(([id, model]) => (
                  <Select.Item key={id} value={id}>
                    {model.name}
                    {model.supportsTools && ' ⚡'}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Box>

          <Box className="bg-slate-700/50 rounded p-3">
            <Text size="2" weight="medium" className="block mb-1">
              {AVAILABLE_MODELS[$settings.selectedModel].name}
            </Text>
            <Text size="1" className="text-slate-400 block mb-1">
              Provider: {AVAILABLE_MODELS[$settings.selectedModel].provider}
            </Text>
            <Text size="1" className="text-slate-400 block">
              {AVAILABLE_MODELS[$settings.selectedModel].description}
            </Text>
            {AVAILABLE_MODELS[$settings.selectedModel].supportsTools && (
              <Text size="1" className="text-green-400 block mt-2">
                ⚡ Supports streaming tools
              </Text>
            )}
          </Box>

          <Flex justify="between" align="center" className="py-2 border-t border-slate-700">
            <Box>
              <Text size="3" className="block">Enable Thinking Display</Text>
              <Text size="2" className="text-slate-400 mt-1 block">
                Show AI reasoning process
              </Text>
            </Box>
            <Box className="bg-orange-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
              TODO
            </Box>
          </Flex>
        </Flex>
      </Box>

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
