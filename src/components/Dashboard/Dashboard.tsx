import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { IconSparkles, IconPlus, IconArrowRight } from '@tabler/icons-react'
import { appsQueryOptions } from '../../queries/apps'
import { useAppGeneration } from '../../hooks/useAppGeneration'
import { useStore } from '@nanostores/react'
import { generation } from '../../stores/generation'
import { AppleMenu } from '../Shared/AppleMenu'
import { signOut } from '../../lib/auth-client'
import { resetUIState } from '../../stores/ui'
import { motion, AnimatePresence } from 'motion/react'
import { generateMeshGradient } from '../../utils/colors'

export function Dashboard() {
  const { data: apps = [] } = useQuery(appsQueryOptions)
  const [prompt, setPrompt] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const $generation = useStore(generation)
  const { generateApp } = useAppGeneration()

  const handleSignOut = async () => {
    resetUIState()
    localStorage.removeItem('emagine_remembered_email')
    localStorage.removeItem('emagine_remembered_name')
    await signOut()
    window.location.reload()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || $generation.isGenerating) return

    const userPrompt = prompt
    setPrompt('')
    await generateApp(userPrompt)
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Background Ambient Glow & Noise */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center bg-black">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[800px] h-[800px] bg-[#0080ff]/20 rounded-full blur-[120px] -top-64 -left-64 mix-blend-screen"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute w-[600px] h-[600px] bg-[#9d4edd]/20 rounded-full blur-[100px] top-32 right-[-200px] mix-blend-screen"
        />
        <div 
          className="absolute inset-0 opacity-[0.04] mix-blend-screen" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, 
            backgroundRepeat: 'repeat', 
            backgroundSize: '128px' 
          }}
        />
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-6 bg-black/40 backdrop-blur-2xl backdrop-saturate-[2] border-b border-white/5 supports-backdrop-filter:bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[10px] bg-linear-to-b from-gray-700 to-gray-900 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] border border-black overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/20 to-purple-500/20" />
            <span className="text-sm font-bold tracking-tight text-white drop-shadow-md">E</span>
          </div>
          <span className="font-semibold text-[17px] tracking-[-0.4px] text-white/90">Emagine</span>
        </div>
        <AppleMenu onSignOut={handleSignOut} />
      </nav>

      <main className="relative z-10 flex flex-col max-w-[1024px] mx-auto w-full px-6 pt-32 pb-24 gap-20">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center gap-10 max-w-3xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <h1 className="text-[56px] leading-[1.05] md:text-[72px] font-bold tracking-[-0.04em] text-transparent bg-clip-text bg-linear-to-b from-white to-white/70 drop-shadow-sm">
              Imagine it.<br />Build it.
            </h1>
            <p className="text-[21px] leading-[1.4] tracking-[-0.01em] text-white/60 max-w-[560px] mx-auto font-medium drop-shadow-sm">
              Describe your idea in plain English and let AI craft a production-ready app in seconds.
            </p>
          </motion.div>

          <div className="w-full relative max-w-[680px]">
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              onSubmit={handleSubmit} 
              className="relative w-full z-20 group"
            >
              <div className="relative rounded-[24px] p-px transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.01] focus-within:scale-[1.02]">
                {/* Apple Intelligence Style Gradient Border */}
                <div className="absolute inset-0 rounded-[24px] bg-linear-to-r from-[#ff2a5f] via-[#0080ff] to-[#44ffd2] opacity-40 blur-xs group-hover:opacity-70 focus-within:opacity-100 transition-opacity duration-500 pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute inset-0 rounded-[24px] bg-linear-to-r from-[#ff2a5f] via-[#0080ff] to-[#44ffd2] opacity-60 pointer-events-none" />
                
                <div className="relative flex items-center bg-[#1c1c1e] rounded-[23px] p-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)]">
                  <div className="pl-4 pr-2 text-white/40 flex items-center justify-center">
                    <IconSparkles size={24} strokeWidth={1.5} className={isFocused ? 'text-blue-400' : ''} />
                  </div>
                  <input
                    type="text"
                    placeholder="A pomodoro tracker with minimal aesthetics..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={$generation.isGenerating}
                    className="flex-1 bg-transparent text-[19px] tracking-[-0.02em] text-white placeholder:text-white/30 px-2 py-4 outline-none min-w-0"
                  />
                  <button
                    type="submit"
                    disabled={!prompt.trim() || $generation.isGenerating}
                    className="ml-2 h-12 w-12 rounded-full bg-white text-black hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center shadow-[0_4px_12px_rgba(255,255,255,0.2)]"
                  >
                    {$generation.isGenerating ? (
                      <div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                    ) : (
                      <IconArrowRight size={20} strokeWidth={2.5} />
                    )}
                  </button>
                </div>
              </div>
              
              <AnimatePresence>
                {$generation.isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -bottom-10 left-0 right-0 flex justify-center"
                  >
                    <span className="text-[13px] font-medium tracking-tight text-white/60 flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                      Crafting your experience...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>

            {/* Sample Prompts */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-3 relative z-10"
            >
              {[
                "A minimalist habit tracker",
                "Personal finance dashboard",
                "Recipe manager app"
              ].map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(sample)}
                  disabled={$generation.isGenerating}
                  className="px-4 py-2 rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] border border-white/5 hover:border-white/10 text-[13px] font-medium text-white/70 hover:text-white transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.2)] flex items-center gap-1.5"
                >
                  <IconSparkles size={14} className="text-white/40" />
                  {sample}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Apps Grid */}
        <section className="flex flex-col gap-8 w-full">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <h2 className="text-[28px] font-bold tracking-[-0.02em] text-white/90">Recent Apps</h2>
            <span className="text-[15px] font-medium tracking-tight text-white/40 mb-1">
              {apps.length} {apps.length === 1 ? 'App' : 'Apps'}
            </span>
          </div>

          {apps.length === 0 && !$generation.isGenerating ? (
            <div className="flex flex-col items-center justify-center py-32 px-6 rounded-[32px] bg-[#1c1c1e]/50 border border-white/5 text-center gap-5">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <IconPlus size={32} strokeWidth={1.5} className="text-white/40" />
              </div>
              <h3 className="text-[21px] font-semibold tracking-[-0.01em] text-white/80">No apps yet</h3>
              <p className="text-[15px] text-white/40 max-w-sm font-medium">
                Your generated applications will appear here. Start by typing a prompt above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app) => (
                <Link
                  key={app.id}
                  to="/a/$appId"
                  params={{ appId: app.id }}
                  className="group flex flex-col bg-[#1c1c1e]/80 hover:bg-[#2c2c2e] border border-white/8 hover:border-white/15 rounded-[28px] p-6 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] overflow-hidden relative"
                >
                  {/* Status Overlay */}
                  {app.status === 'generating' && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      <span className="text-sm font-medium text-white/80">Generating...</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div 
                      className="w-[72px] h-[72px] flex items-center justify-center text-[40px] rounded-[20px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden"
                    >
                      <div className="absolute inset-0 opacity-80" style={{ background: generateMeshGradient(app.id) }} />
                      <div className="absolute inset-0 bg-black/10" />
                      <span className="relative z-10">{app.icon || '📱'}</span>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-white/40 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                      <IconArrowRight size={16} strokeWidth={2} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 relative z-10">
                    <h3 className="font-semibold text-[21px] tracking-[-0.01em] text-white/90 truncate group-hover:text-white transition-colors">
                      {app.name || 'Untitled App'}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-white/50 line-clamp-2 font-medium">
                      {app.description || app.prompt || 'No description provided'}
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-4 flex items-center justify-between border-t border-white/5">
                    <span className="text-[13px] font-medium text-white/30">
                      {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 bg-white/5 text-white/50 rounded-full">
                      {app.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
