export type SettingsSection = 'account' | 'appearance' | 'ai-models' | 'apps' | 'about'

interface SidebarItem {
  id: SettingsSection
  icon: string
  label: string
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'account', icon: '👤', label: 'Account' },
  { id: 'appearance', icon: '🎨', label: 'Appearance' },
  { id: 'ai-models', icon: '🤖', label: 'AI Models' },
  { id: 'apps', icon: '📱', label: 'Apps' },
  { id: 'about', icon: 'ℹ️', label: 'About' },
]

interface SettingsSidebarProps {
  activeSection: SettingsSection
  onSectionChange: (section: SettingsSection) => void
}

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <div className="flex flex-col w-[180px] bg-[#2a2a2a] border-r border-white/10 pt-1 pb-2">
      <div className="px-3 py-2 mb-1">
        <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
          Settings
        </span>
      </div>
      {SIDEBAR_ITEMS.map((item) => {
        const isActive = activeSection === item.id
        return (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`flex items-center gap-2.5 px-3 py-1.5 mx-1.5 rounded-md text-left transition-colors ${
              isActive
                ? 'bg-blue-500/90'
                : 'hover:bg-white/5'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span
              className={`text-[13px] ${isActive ? 'font-medium text-white' : 'text-white/80'}`}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
