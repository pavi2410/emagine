interface BSODProps {
  errorCode: string
  message: string
  onRestart?: () => void
}

export function BSOD({ errorCode, message, onRestart }: BSODProps) {
  return (
    <div className="fixed inset-0 z-[9999] bg-blue-600 flex items-center justify-center p-8">
      <div className="flex flex-col gap-6 max-w-2xl">
        <span className="text-3xl font-bold text-white">
          :(
        </span>

        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-medium text-white">
            Your AI Desktop ran into a problem and needs to restart.
          </h1>

          <p className="text-base text-blue-100">
            {message}
          </p>

          <code className="bg-blue-800 text-blue-100 p-4 rounded font-mono text-sm">
            Error Code: {errorCode}
          </code>

          <p className="text-sm text-blue-200">
            If you call the support person, give them this info:
            <br />
            STOP: 0x{errorCode.padStart(8, '0')}
          </p>
        </div>

        {onRestart && (
          <button
            onClick={onRestart}
            className="bg-white text-blue-600 hover:bg-blue-50 cursor-pointer px-4 py-2 rounded-md font-medium"
          >
            Restart Desktop
          </button>
        )}

        <span className="text-xs text-blue-300">
          🤖 Generated with Emagine - AI Desktop Environment
        </span>
      </div>
    </div>
  )
}
