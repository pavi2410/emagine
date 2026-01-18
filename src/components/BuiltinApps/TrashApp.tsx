import { Box, Flex, Text, Button, ScrollArea } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import * as ContextMenu from '@radix-ui/react-context-menu'
import { trashedAppsQueryOptions, useRestoreApp, usePermanentlyDeleteApp, useEmptyTrash, type TrashedApp } from '../../queries/trash'

function formatDeletedDate(deletedAt: string): string {
  const date = new Date(deletedAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

function TrashItem({ app }: { app: TrashedApp }) {
  const restoreApp = useRestoreApp()
  const permanentlyDeleteApp = usePermanentlyDeleteApp()

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <Flex
          align="center"
          gap="3"
          className="p-3 rounded-lg hover:bg-slate-800/50 cursor-default transition-colors"
        >
          <Box className="text-3xl">{app.icon}</Box>
          <Flex direction="column" className="flex-1 min-w-0">
            <Text size="2" weight="medium" className="text-white truncate">
              {app.name}
            </Text>
            <Text size="1" className="text-slate-500">
              Deleted {formatDeletedDate(app.deletedAt)}
            </Text>
          </Flex>
        </Flex>
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content className="min-w-[160px] bg-slate-900/95 backdrop-blur-xl rounded-lg shadow-2xl border border-slate-700/50 py-1.5 z-[9999]">
          <ContextMenu.Item
            className="px-3 py-2 text-white text-sm cursor-pointer outline-none hover:bg-blue-500/30 rounded-md mx-1 transition-colors"
            onSelect={() => restoreApp.mutate(app.id)}
          >
            Restore
          </ContextMenu.Item>
          <ContextMenu.Separator className="h-px bg-slate-700/50 my-1.5" />
          <ContextMenu.Item
            className="px-3 py-2 text-red-400 text-sm cursor-pointer outline-none hover:bg-red-500/20 rounded-md mx-1 transition-colors"
            onSelect={() => permanentlyDeleteApp.mutate(app.id)}
          >
            Delete Permanently
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}

export function TrashApp() {
  const { data: trashedApps = [], isLoading } = useQuery(trashedAppsQueryOptions)
  const emptyTrash = useEmptyTrash()

  const isEmpty = trashedApps.length === 0

  return (
    <Box className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <Flex
        justify="between"
        align="center"
        className="p-4 border-b border-slate-700/50"
      >
        <Flex align="center" gap="2">
          <Text size="5" weight="bold" className="text-white">
            Trash
          </Text>
          {!isEmpty && (
            <Text size="2" className="text-slate-500">
              {trashedApps.length} {trashedApps.length === 1 ? 'item' : 'items'}
            </Text>
          )}
        </Flex>
        {!isEmpty && (
          <Button
            size="1"
            variant="soft"
            color="red"
            onClick={() => emptyTrash.mutate()}
            disabled={emptyTrash.isPending}
          >
            {emptyTrash.isPending ? 'Emptying...' : 'Empty Trash'}
          </Button>
        )}
      </Flex>

      {/* Content */}
      {isLoading ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          className="flex-1 text-slate-500"
        >
          <Text size="3">Loading...</Text>
        </Flex>
      ) : isEmpty ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          className="flex-1 text-slate-500"
        >
          <Box className="text-6xl mb-4 opacity-50">🗑️</Box>
          <Text size="4" className="mb-2 text-slate-400">Trash is empty</Text>
          <Text size="2" className="text-slate-600">
            Right-click apps to move them to trash
          </Text>
        </Flex>
      ) : (
        <ScrollArea className="flex-1">
          <Box className="p-2">
            {trashedApps.map((app) => (
              <TrashItem key={app.id} app={app} />
            ))}
          </Box>
        </ScrollArea>
      )}
    </Box>
  )
}
