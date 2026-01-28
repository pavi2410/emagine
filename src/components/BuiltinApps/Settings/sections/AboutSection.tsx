export function AboutSection() {
  return (
    <div className="p-5">
      <h2 className="text-[13px] font-semibold mb-4 text-white/90">About</h2>

      {/* App Info */}
      <div className="bg-white/5 rounded-lg p-5 mb-3">
        <div className="flex flex-col items-center py-2">
          <span className="text-4xl mb-2">✨</span>
          <h1 className="text-[16px] font-semibold text-white/90 mb-0.5">
            Emagine
          </h1>
          <span className="text-[11px] text-white/40 mb-3">Version 1.0</span>
          <p className="text-[12px] text-white/60 text-center max-w-xs leading-relaxed">
            AI-powered app generation platform.<br />
            Describe what you want, and watch it come to life.
          </p>
        </div>
      </div>

      {/* Technical Info */}
      <div className="bg-white/5 rounded-lg overflow-hidden mb-3">
        <div className="px-4 py-2.5 border-b border-white/5">
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-wide">
            Technical Details
          </span>
        </div>

        <div className="divide-y divide-white/5">
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-[13px] text-white/60">Powered by</span>
            <span className="text-[13px] text-white/90">OpenRouter</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-[13px] text-white/60">Framework</span>
            <span className="text-[13px] text-white/90">React + TanStack</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-[13px] text-white/60">UI Library</span>
            <span className="text-[13px] text-white/90">Base UI + Tailwind</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-[13px] text-white/60">Runtime</span>
            <span className="text-[13px] text-white/90">Bun</span>
          </div>
        </div>
      </div>

      {/* Credits */}
      <div className="bg-white/5 rounded-lg p-4">
        <p className="text-[12px] text-white/50 text-center">
          Built with ❤️ using modern web technologies
        </p>
        <p className="text-[11px] text-white/30 text-center mt-1">
          © 2025 Emagine. All rights reserved.
        </p>
      </div>
    </div>
  )
}
