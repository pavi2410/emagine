import { useState, useEffect } from 'react'
import { SettingsSidebar, type SettingsSection } from './Settings/SettingsSidebar'
import { SettingsContent } from './Settings/SettingsContent'
import { closeWindowByAppId } from '../../stores/windows'

export function SettingsApp() {
  const [activeSection, setActiveSection] = useState<SettingsSection | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // On desktop, always show a section
  useEffect(() => {
    if (!isMobile && activeSection === null) {
      setActiveSection('account')
    }
  }, [isMobile, activeSection])

  const handleSectionChange = (section: SettingsSection) => {
    setActiveSection(section)
  }

  const handleBack = () => {
    setActiveSection(null)
  }

  const handleClose = () => {
    closeWindowByAppId('__builtin_settings')
  }

  // Mobile: two-screen navigation (iOS style)
  if (isMobile) {
    return (
      <div className="h-full bg-[#1c1c1e] overflow-hidden">
        {activeSection === null ? (
          <SettingsSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            isMobile={true}
            onClose={handleClose}
          />
        ) : (
          <SettingsContent 
            section={activeSection} 
            isMobile={true}
            onBack={handleBack}
          />
        )}
      </div>
    )
  }

  // Desktop: side-by-side layout
  return (
    <div className="flex h-full bg-black/60 backdrop-blur-2xl">
      <SettingsSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isMobile={false}
      />
      <SettingsContent section={activeSection || 'account'} isMobile={false} />
    </div>
  )
}
