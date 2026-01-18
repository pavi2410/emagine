import { Box, Flex, Text, Select } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { settingsQueryOptions, useUpdateSettings, AVAILABLE_MODELS, type ModelId } from '../../../../queries/settings'

export function AIModelsSection() {
  const { data: settings } = useQuery(settingsQueryOptions)
  const updateSettings = useUpdateSettings()

  const currentModel = settings?.selectedModel ? AVAILABLE_MODELS[settings.selectedModel as ModelId] : null

  return (
    <Box className="p-6">
      <Text size="5" weight="bold" className="mb-6 block text-white">
        AI Models
      </Text>

      {/* Model Selection */}
      <Box className="bg-slate-800/50 rounded-xl p-5 mb-4">
        <Text size="3" weight="medium" className="mb-4 block text-slate-300">
          Generation Model
        </Text>

        <Flex direction="column" gap="4">
          <Box>
            <Text size="2" className="text-slate-400 mb-2 block">
              Select Model
            </Text>
            <Select.Root
              value={settings?.selectedModel}
              onValueChange={(value) => updateSettings.mutate({ selectedModel: value as ModelId })}
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

          {/* Model Info Card */}
          {currentModel && (
            <Box className="bg-slate-700/50 rounded-lg p-4">
              <Text size="2" weight="medium" className="block mb-1 text-white">
                {currentModel.name}
              </Text>
              <Text size="1" className="text-slate-400 block mb-1">
                Provider: {currentModel.provider}
              </Text>
              <Text size="1" className="text-slate-400 block">
                {currentModel.description}
              </Text>
              {currentModel.supportsTools && (
                <Text size="1" className="text-green-400 block mt-2">
                  ⚡ Supports streaming tools
                </Text>
              )}
            </Box>
          )}
        </Flex>
      </Box>

      {/* Advanced Options */}
      <Box className="bg-slate-800/50 rounded-xl p-5">
        <Text size="3" weight="medium" className="mb-4 block text-slate-300">
          Advanced Options
        </Text>

        <Flex direction="column" gap="3">
          <Flex justify="between" align="center" className="py-2 border-b border-slate-700/50">
            <Flex direction="column" gap="1">
              <Text size="2" className="text-white">Enable Thinking Display</Text>
              <Text size="1" className="text-slate-500">Show AI reasoning process</Text>
            </Flex>
            <Box className="bg-orange-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
              Coming Soon
            </Box>
          </Flex>

          <Flex justify="between" align="center" className="py-2">
            <Flex direction="column" gap="1">
              <Text size="2" className="text-white">Bring Your Own Key (BYOK)</Text>
              <Text size="1" className="text-slate-500">Use your own API keys</Text>
            </Flex>
            <Box className="bg-orange-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
              Coming Soon
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}
