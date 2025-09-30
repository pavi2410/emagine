import { Box, Flex, Text } from '@radix-ui/themes'

export function TrashApp() {
  return (
    <Box className="p-6 h-full flex flex-col bg-slate-900">
      <Text size="6" weight="bold" className="mb-6 block">
        🗑️ Trash
      </Text>

      {/* Empty State */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        className="flex-1 text-slate-500"
      >
        <Box className="text-6xl mb-4 opacity-50">🗑️</Box>
        <Text size="5" className="mb-2">Trash is empty</Text>
        <Text size="3" className="text-slate-600">
          Drag apps here to delete them
        </Text>
      </Flex>

      {/* TODO: Add trash items dynamically */}
    </Box>
  )
}
