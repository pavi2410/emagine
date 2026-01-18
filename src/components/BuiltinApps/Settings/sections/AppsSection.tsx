import { Box, Flex, Text, ScrollArea, Button } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { appsQueryOptions, type App } from '../../../../queries/apps'
import { useMoveToTrash } from '../../../../queries/trash'
import { openWindow } from '../../../../stores/windows'

function AppItem({ app }: { app: App }) {
  const moveToTrash = useMoveToTrash()

  const handleOpen = () => {
    openWindow(app.id)
  }

  const handleDelete = () => {
    moveToTrash.mutate(app.id)
  }

  return (
    <Flex
      align="center"
      justify="between"
      className="p-3 rounded-lg hover:bg-slate-700/30 transition-colors"
    >
      <Flex align="center" gap="3">
        <Box className="text-2xl">{app.icon}</Box>
        <Flex direction="column" gap="0">
          <Text size="2" weight="medium" className="text-white">
            {app.name}
          </Text>
          <Text size="1" className="text-slate-500">
            Created {new Date(app.createdAt).toLocaleDateString()}
          </Text>
        </Flex>
      </Flex>

      <Flex gap="2">
        <Button
          size="1"
          variant="soft"
          onClick={handleOpen}
          disabled={app.status !== 'ready'}
        >
          Open
        </Button>
        <Button
          size="1"
          variant="soft"
          color="red"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Flex>
    </Flex>
  )
}

export function AppsSection() {
  const { data: apps = [], isLoading } = useQuery(appsQueryOptions)

  return (
    <Box className="p-6 h-full flex flex-col">
      <Flex justify="between" align="center" className="mb-6">
        <Text size="5" weight="bold" className="text-white">
          Apps
        </Text>
        <Text size="2" className="text-slate-500">
          {apps.length} {apps.length === 1 ? 'app' : 'apps'}
        </Text>
      </Flex>

      {/* Apps List */}
      <Box className="bg-slate-800/50 rounded-xl flex-1 overflow-hidden">
        {isLoading ? (
          <Flex align="center" justify="center" className="h-full">
            <Text size="2" className="text-slate-500">Loading...</Text>
          </Flex>
        ) : apps.length === 0 ? (
          <Flex direction="column" align="center" justify="center" className="h-full py-12">
            <Box className="text-5xl mb-4 opacity-50">📱</Box>
            <Text size="3" className="text-slate-400 mb-2">No apps yet</Text>
            <Text size="2" className="text-slate-500">
              Use the prompt bar to create your first app
            </Text>
          </Flex>
        ) : (
          <ScrollArea className="h-full">
            <Box className="p-2">
              {apps.map((app) => (
                <AppItem key={app.id} app={app} />
              ))}
            </Box>
          </ScrollArea>
        )}
      </Box>
    </Box>
  )
}
