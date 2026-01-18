interface TrafficLightsProps {
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  isMaximized?: boolean
}

export function TrafficLights({
  onClose,
  onMinimize,
  onMaximize,
  isMaximized = false,
}: TrafficLightsProps) {
  return (
    <div className="flex gap-2 group mr-3">
      {/* Close button */}
      <button
        onClick={onClose}
        className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4136] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12),inset_0_-1px_1px_rgba(0,0,0,0.08)] transition-colors flex items-center justify-center"
        title="Close"
      >
        <svg
          className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M2 2l6 6M8 2l-6 6" />
        </svg>
      </button>

      {/* Minimize button */}
      <button
        onClick={onMinimize}
        className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#e5a922] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12),inset_0_-1px_1px_rgba(0,0,0,0.08)] transition-colors flex items-center justify-center"
        title="Minimize"
      >
        <svg
          className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M2 5h6" />
        </svg>
      </button>

      {/* Maximize button */}
      <button
        onClick={onMaximize}
        className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#22ad38] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12),inset_0_-1px_1px_rgba(0,0,0,0.08)] transition-colors flex items-center justify-center"
        title={isMaximized ? 'Restore' : 'Maximize'}
      >
        <svg
          className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          {isMaximized ? (
            // Restore icon (two small rectangles)
            <>
              <path d="M3 3v4h4V3H3z" />
              <path d="M5 1h4v4" />
            </>
          ) : (
            // Maximize icon (diagonal arrows)
            <>
              <path d="M2 8L8 2" />
              <path d="M5 2h3v3" />
              <path d="M5 8H2V5" />
            </>
          )}
        </svg>
      </button>
    </div>
  )
}
