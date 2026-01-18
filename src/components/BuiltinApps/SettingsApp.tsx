import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { SettingsSidebar, type SettingsSection } from './Settings/SettingsSidebar'
import { SettingsContent } from './Settings/SettingsContent'

export function SettingsApp() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('account')

  return (
    <Flex className="h-full bg-slate-900">
      <SettingsSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <SettingsContent section={activeSection} />
    </Flex>
  )
}
