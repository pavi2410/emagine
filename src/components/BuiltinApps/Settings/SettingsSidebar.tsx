import { IconChevronRight } from '@tabler/icons-react'

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
  activeSection: SettingsSection | null
  onSectionChange: (section: SettingsSection) => void
  isMobile?: boolean
  onClose?: () => void
}

export function SettingsSidebar({ activeSection, onSectionChange, isMobile, onClose }: SettingsSidebarProps) {
  // Mobile: iOS-style list
  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-[#1c1c1e]">
        {/* Header with Done button */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h1 className="text-[34px] font-bold text-white">Settings</h1>
          {onClose && (
            <button
              onClick={onClose}
              className="text-[17px] text-blue-500 font-semibold"
            >
              Done
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="bg-[#2c2c2e] mx-4 rounded-xl overflow-hidden">
            {SIDEBAR_ITEMS.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className="flex items-center w-full px-4 py-3 active:bg-white/10 transition-colors"
              >
                <span className="text-2xl mr-3">{item.icon}</span>
                <span className="flex-1 text-[17px] text-white text-left">{item.label}</span>
                <IconChevronRight size={20} className="text-white/30" />
                {index < SIDEBAR_ITEMS.length - 1 && (
                  <div className="absolute bottom-0 left-16 right-0 h-px bg-white/10" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Desktop: macOS-style sidebar
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
