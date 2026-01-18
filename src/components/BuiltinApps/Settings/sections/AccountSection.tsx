import { Box, Flex, Text, Button } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useSession } from '../../../../lib/auth-client'
import { settingsQueryOptions } from '../../../../queries/settings'
import { UserAvatar } from '../../../Auth/UserAvatar'

export function AccountSection() {
  const { data: session } = useSession()
  const { data: settings } = useQuery(settingsQueryOptions)

  const user = session?.user

  return (
    <Box className="p-6">
      <Text size="5" weight="bold" className="mb-6 block text-white">
        Account
      </Text>

      {/* Profile Card */}
      <Box className="bg-slate-800/50 rounded-xl p-6 mb-4">
        <Flex align="center" gap="4">
          <UserAvatar
            avatarId={settings?.avatar || 'gradient-1'}
            name={user?.name || ''}
            size="lg"
          />
          <Flex direction="column" gap="1">
            <Text size="4" weight="medium" className="text-white">
              {user?.name || 'User'}
            </Text>
            <Text size="2" className="text-slate-400">
              {user?.email}
            </Text>
          </Flex>
        </Flex>
      </Box>

      {/* Account Details */}
      <Box className="bg-slate-800/50 rounded-xl p-5">
        <Text size="3" weight="medium" className="mb-4 block text-slate-300">
          Account Details
        </Text>

        <Flex direction="column" gap="3">
          <Flex justify="between" align="center" className="py-2 border-b border-slate-700/50">
            <Text size="2" className="text-slate-400">Name</Text>
            <Text size="2" className="text-white">{user?.name || 'Not set'}</Text>
          </Flex>
          <Flex justify="between" align="center" className="py-2 border-b border-slate-700/50">
            <Text size="2" className="text-slate-400">Email</Text>
            <Text size="2" className="text-white">{user?.email}</Text>
          </Flex>
          <Flex justify="between" align="center" className="py-2">
            <Text size="2" className="text-slate-400">Account Created</Text>
            <Text size="2" className="text-white">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}
