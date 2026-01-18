import { Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { trashedAppsQueryOptions } from '../../queries/trash'
import { openWindow } from '../../stores/windows'

export function TrashIcon() {
  const { data: trashedApps = [] } = useQuery(trashedAppsQueryOptions)
  const hasItems = trashedApps.length > 0

  const handleDoubleClick = () => {
    openWindow('__builtin_trash')
  }

  return (
    <Flex
      direction="column"
      align="center"
      gap="2"
      className="w-24 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-colors"
      onDoubleClick={handleDoubleClick}
    >
      <div className="text-5xl relative">
        {hasItems ? '🗑️' : '🗑️'}
        {hasItems && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">
              {trashedApps.length > 9 ? '9+' : trashedApps.length}
            </span>
          </div>
        )}
      </div>
      <Text size="2" className="text-white text-center">
        Trash
      </Text>
    </Flex>
  )
}
