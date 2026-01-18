import { useState } from 'react'
import { SettingsSidebar, type SettingsSection } from './Settings/SettingsSidebar'
import { SettingsContent } from './Settings/SettingsContent'

export function SettingsApp() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('account')

  return (
    <div className="flex h-full bg-slate-900">
      <SettingsSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <SettingsContent section={activeSection} />
    </div>
  )
}
