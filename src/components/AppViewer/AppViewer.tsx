import { IconArrowLeft, IconShare, IconDeviceDesktop } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { ProgressiveContent } from './ProgressiveContent'
import { useQuery } from '@tanstack/react-query'
import { appsQueryOptions } from '../../queries/apps'
import { toast } from 'sonner'
import { useState } from 'react'

interface AppViewerProps {
  appId: string
}

export function AppViewer({ appId }: AppViewerProps) {
  const { data: apps = [] } = useQuery(appsQueryOptions)
  const app = apps.find((a) => a.id === appId)
  const [isHovering, setIsHovering] = useState(false)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: app?.name || 'Emagine App',
        text: app?.description || 'Check out this app built with Emagine!',
        url: window.location.href,
      }).catch((error) => console.error('Error sharing', error))
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleInstall = () => {
    // Show install instructions based on OS/Browser
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    
    if (isIOS && isSafari) {
      toast('Install App', {
        description: 'Tap the Share button at the bottom of the screen, then select "Add to Home Screen".',
        duration: 5000,
      })
    } else {
      toast('Install App', {
        description: 'Look for the "Install" or "Add to Home Screen" option in your browser menu.',
        duration: 5000,
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50 overflow-hidden">
      {/* Dynamic Island style navigation - Float at the top */}
      <div 
        className="absolute top-4 left-0 right-0 flex justify-center z-50 pointer-events-none"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className={`
          pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-[#1c1c1e]/80 backdrop-blur-3xl backdrop-saturate-[2] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isHovering ? 'scale-100 opacity-100' : 'scale-95 opacity-80 sm:opacity-40 hover:opacity-100'}
        `}>
          <Link 
            to="/"
            className="flex items-center justify-center w-10 h-10 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Back to Dashboard"
          >
            <IconArrowLeft size={20} strokeWidth={2} />
          </Link>
          
          <div className="w-px h-6 bg-white/10 mx-1" />
          
          {app && (
            <div className="flex flex-col px-3 max-w-[200px] select-none">
              <span className="text-[13px] font-semibold tracking-tight text-white truncate leading-tight">
                {app.name || 'App'}
              </span>
              <span className="text-[11px] font-medium tracking-tight text-white/50 truncate leading-tight">
                Emagine
              </span>
            </div>
          )}
          
          <div className="w-px h-6 bg-white/10 mx-1" />
          
          <button 
            onClick={handleShare}
            className="flex items-center justify-center w-10 h-10 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Share"
          >
            <IconShare size={20} strokeWidth={2} />
          </button>
          
          <button 
            onClick={handleInstall}
            className="flex items-center justify-center w-10 h-10 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors mr-0.5"
            title="Install App"
          >
            <IconDeviceDesktop size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* App Content */}
      <div className="flex-1 w-full h-full relative bg-white sm:rounded-[32px] sm:m-4 sm:mt-24 overflow-hidden sm:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <ProgressiveContent appId={appId} />
      </div>
    </div>
  )
}
