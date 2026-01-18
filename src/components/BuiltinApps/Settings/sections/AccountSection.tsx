import { useQuery } from '@tanstack/react-query'
import { useSession } from '../../../../lib/auth-client'
import { settingsQueryOptions } from '../../../../queries/settings'
import { UserAvatar } from '../../../Auth/UserAvatar'

export function AccountSection() {
  const { data: session } = useSession()
  const { data: settings } = useQuery(settingsQueryOptions)

  const user = session?.user

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 text-white">
        Account
      </h2>

      {/* Profile Card */}
      <div className="bg-slate-800/50 rounded-xl p-6 mb-4">
        <div className="flex items-center gap-4">
          <UserAvatar
            avatarId={settings?.avatar || 'gradient-1'}
            name={user?.name || ''}
            size="lg"
          />
          <div className="flex flex-col gap-1">
            <span className="text-lg font-medium text-white">
              {user?.name || 'User'}
            </span>
            <span className="text-sm text-slate-400">
              {user?.email}
            </span>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-slate-800/50 rounded-xl p-5">
        <h3 className="text-base font-medium mb-4 text-slate-300">
          Account Details
        </h3>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span className="text-sm text-slate-400">Name</span>
            <span className="text-sm text-white">{user?.name || 'Not set'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span className="text-sm text-slate-400">Email</span>
            <span className="text-sm text-white">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-slate-400">Account Created</span>
            <span className="text-sm text-white">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
