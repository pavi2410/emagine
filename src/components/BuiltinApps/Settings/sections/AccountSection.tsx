import { useQuery } from '@tanstack/react-query'
import { useSession } from '../../../../lib/auth-client'
import { settingsQueryOptions } from '../../../../queries/settings'
import { UserAvatar } from '../../../Auth/UserAvatar'

export function AccountSection() {
  const { data: session } = useSession()
  const { data: settings } = useQuery(settingsQueryOptions)

  const user = session?.user

  return (
    <div className="p-5">
      <h2 className="text-[13px] font-semibold mb-4 text-white/90">
        Account
      </h2>

      {/* Profile Card */}
      <div className="bg-white/5 rounded-lg p-4 mb-3">
        <div className="flex items-center gap-3">
          <UserAvatar
            avatarId={settings?.avatar || 'gradient-1'}
            name={user?.name || ''}
            size="lg"
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-medium text-white/90">
              {user?.name || 'User'}
            </span>
            <span className="text-[12px] text-white/50">
              {user?.email}
            </span>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white/5 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/5">
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-wide">
            Account Details
          </span>
        </div>

        <div className="divide-y divide-white/5">
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-[13px] text-white/60">Name</span>
            <span className="text-[13px] text-white/90">{user?.name || 'Not set'}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-[13px] text-white/60">Email</span>
            <span className="text-[13px] text-white/90">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-[13px] text-white/60">Account Created</span>
            <span className="text-[13px] text-white/90">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
