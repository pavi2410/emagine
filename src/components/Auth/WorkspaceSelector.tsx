import { useState, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { Box, Button, Flex, Text, TextField, Dialog, Select } from '@radix-ui/themes'
import {
  workspaces,
  currentWorkspaceId,
  loadWorkspaces,
  createWorkspace,
  selectWorkspace,
  isLoading,
} from '../../stores/workspace'

export function WorkspaceSelector() {
  const $workspaces = useStore(workspaces)
  const $currentWorkspaceId = useStore(currentWorkspaceId)
  const $isLoading = useStore(isLoading)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')

  useEffect(() => {
    loadWorkspaces()
  }, [])

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return

    await createWorkspace(newWorkspaceName.trim())
    setNewWorkspaceName('')
    setIsDialogOpen(false)
  }

  if ($isLoading && $workspaces.length === 0) {
    return (
      <Flex align="center" gap="2" className="px-3 py-2">
        <Text size="2" className="text-slate-400">
          Loading...
        </Text>
      </Flex>
    )
  }

  return (
    <Flex align="center" gap="2" className="px-3 py-2">
      {$workspaces.length > 0 ? (
        <Select.Root
          value={$currentWorkspaceId || undefined}
          onValueChange={selectWorkspace}
        >
          <Select.Trigger placeholder="Select workspace" />
          <Select.Content>
            {$workspaces.map((ws) => (
              <Select.Item key={ws.id} value={ws.id}>
                {ws.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      ) : (
        <Text size="2" className="text-slate-400">
          No workspaces
        </Text>
      )}

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Trigger>
          <Button size="1" variant="soft">
            + New
          </Button>
        </Dialog.Trigger>

        <Dialog.Content style={{ maxWidth: 400 }}>
          <Dialog.Title>Create Workspace</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Create a new workspace to organize your apps.
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <Box>
              <Text size="2" className="text-slate-400 mb-1 block">
                Workspace Name
              </Text>
              <TextField.Root
                placeholder="My Workspace"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateWorkspace()
                  }
                }}
              />
            </Box>

            <Flex gap="3" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button onClick={handleCreateWorkspace} disabled={!newWorkspaceName.trim()}>
                Create
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  )
}
