import { useState, useEffect } from 'react'
import { Desktop } from './Desktop/Desktop'
import { MobileDesktop } from './Mobile/MobileDesktop'
import { MobileWindowManager } from './Mobile/MobileWindowManager'
import { MobilePromptBar } from './Mobile/MobilePromptBar'

export function ResponsiveDesktop() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile) {
    return (
      <>
        <MobileDesktop />
        <MobileWindowManager />
        <MobilePromptBar />
      </>
    )
  }

  return <Desktop />
}
