export function AboutSection() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 text-white">
        About
      </h2>

      {/* App Info */}
      <div className="bg-slate-800/50 rounded-xl p-6 mb-4">
        <div className="flex flex-col items-center py-4">
          <span className="text-5xl mb-3">✨</span>
          <h1 className="text-2xl font-bold text-white mb-1">
            emagine
          </h1>
          <span className="text-sm text-slate-400 mb-4">
            Version 1.0
          </span>
          <p className="text-sm text-slate-300 text-center max-w-sm">
            AI-powered app generation platform. Describe what you want, and watch it come to life.
          </p>
        </div>
      </div>

      {/* Technical Info */}
      <div className="bg-slate-800/50 rounded-xl p-5 mb-4">
        <h3 className="text-base font-medium mb-4 text-slate-300">
          Technical Details
        </h3>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span className="text-sm text-slate-400">Powered by</span>
            <span className="text-sm text-white">OpenRouter</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span className="text-sm text-slate-400">Framework</span>
            <span className="text-sm text-white">React + TanStack</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span className="text-sm text-slate-400">UI Library</span>
            <span className="text-sm text-white">Base UI + Tailwind</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-slate-400">Runtime</span>
            <span className="text-sm text-white">Bun</span>
          </div>
        </div>
      </div>

      {/* Credits */}
      <div className="bg-slate-800/50 rounded-xl p-5">
        <h3 className="text-base font-medium mb-4 text-slate-300">
          Credits
        </h3>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-slate-400">
            Built with love using modern web technologies.
          </p>
          <p className="text-sm text-slate-500">
            © 2025 emagine. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
