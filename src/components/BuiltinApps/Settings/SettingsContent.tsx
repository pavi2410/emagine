import { ScrollArea } from '../../ui/ScrollArea'
import type { SettingsSection } from './SettingsSidebar'
import { AccountSection } from './sections/AccountSection'
import { AppearanceSection } from './sections/AppearanceSection'
import { AIModelsSection } from './sections/AIModelsSection'
import { AppsSection } from './sections/AppsSection'
import { AboutSection } from './sections/AboutSection'

interface SettingsContentProps {
  section: SettingsSection
}

export function SettingsContent({ section }: SettingsContentProps) {
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

  return (
    <ScrollArea className="flex-1">
      {renderSection()}
    </ScrollArea>
  )
}
