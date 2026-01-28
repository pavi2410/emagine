import { IconChevronLeft } from '@tabler/icons-react'
import { ScrollArea } from '../../ui/ScrollArea'
import type { SettingsSection } from './SettingsSidebar'
import { AccountSection } from './sections/AccountSection'
import { AppearanceSection } from './sections/AppearanceSection'
import { AIModelsSection } from './sections/AIModelsSection'
import { AppsSection } from './sections/AppsSection'
import { AboutSection } from './sections/AboutSection'

const SECTION_TITLES: Record<SettingsSection, string> = {
  'account': 'Account',
  'appearance': 'Appearance',
  'ai-models': 'AI Models',
  'apps': 'Apps',
  'about': 'About',
}

interface SettingsContentProps {
  section: SettingsSection
  isMobile?: boolean
  onBack?: () => void
}

export function SettingsContent({ section, isMobile, onBack }: SettingsContentProps) {
  const renderSection = () => {
    switch (section) {
      case 'account':
        return <AccountSection />
      case 'appearance':
        return <AppearanceSection />
      case 'ai-models':
        return <AIModelsSection />
      case 'apps':
        return <AppsSection />
      case 'about':
        return <AboutSection />
      default:
        return <AccountSection />
    }
  }

  // Mobile: iOS-style detail view with back navigation
  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-[#1c1c1e]">
        {/* iOS Navigation Bar */}
        <div className="flex items-center px-4 h-11 border-b border-white/10">
          <button
            onClick={onBack}
            className="flex items-center gap-0.5 text-blue-500 active:opacity-60 transition-opacity -ml-2"
          >
            <IconChevronLeft size={28} strokeWidth={2.5} />
            <span className="text-[17px]">Settings</span>
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-[17px] font-semibold text-white">
            {SECTION_TITLES[section]}
          </span>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {renderSection()}
        </div>
      </div>
    )
  }

  // Desktop: standard content area
  return (
    <ScrollArea className="flex-1">
      {renderSection()}
    </ScrollArea>
  )
}
