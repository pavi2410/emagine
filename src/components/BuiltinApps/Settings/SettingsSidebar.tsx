import { Flex, Text } from '@radix-ui/themes'

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
    <Flex
      direction="column"
      className="w-[200px] bg-slate-800/50 border-r border-slate-700/50 py-2"
    >
      {SIDEBAR_ITEMS.map((item) => {
        const isActive = activeSection === item.id
        return (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-left transition-colors ${
              isActive
                ? 'bg-blue-500/30'
                : 'hover:bg-slate-700/50'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <Text
              size="2"
              weight={isActive ? 'medium' : 'regular'}
              className={isActive ? 'text-white' : 'text-slate-300'}
            >
              {item.label}
            </Text>
          </button>
        )
      })}
    </Flex>
  )
}
