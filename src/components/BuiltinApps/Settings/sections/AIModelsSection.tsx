import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { settingsQueryOptions, useUpdateSettings, AVAILABLE_MODELS, DEFAULT_SYSTEM_PROMPT, type ModelId } from '../../../../queries/settings'

export function AIModelsSection() {
  const { data: settings } = useQuery(settingsQueryOptions)
  const updateSettings = useUpdateSettings()
  const [systemPrompt, setSystemPrompt] = useState('')
  const [promptSaved, setPromptSaved] = useState(false)

  useEffect(() => {
    if (settings) {
      setSystemPrompt(settings.systemPrompt ?? DEFAULT_SYSTEM_PROMPT)
    }
  }, [settings])

  const handleSavePrompt = () => {
    updateSettings.mutate({ systemPrompt }, {
      onSuccess: () => {
        setPromptSaved(true)
        setTimeout(() => setPromptSaved(false), 2000)
      }
    })
  }

  const handleResetPrompt = () => {
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT)
    updateSettings.mutate({ systemPrompt: DEFAULT_SYSTEM_PROMPT })
  }

  const currentModel = settings?.selectedModel ? AVAILABLE_MODELS[settings.selectedModel as ModelId] : null

  return (
    <div className="p-5">
      <h2 className="text-[13px] font-semibold mb-4 text-white/90">
        AI Models
      </h2>

      {/* Model Selection */}
      <div className="bg-white/5 rounded-lg overflow-hidden mb-3">
        <div className="px-4 py-2.5 border-b border-white/5">
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-wide">
            Generation Model
          </span>
        </div>

        <div className="p-3">
          <select
            value={settings?.selectedModel || ''}
            onChange={(e) => updateSettings.mutate({ selectedModel: e.target.value as ModelId })}
            className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-1.5 text-[13px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {Object.entries(AVAILABLE_MODELS).map(([id, model]) => (
              <option key={id} value={id}>
                {model.name}
                {model.supportsTools && ' ⚡'}
              </option>
            ))}
          </select>

          {/* Model Info */}
          {currentModel && (
            <div className="mt-2 p-2.5 bg-black/20 rounded-md">
              <span className="text-[12px] font-medium text-white/80 block">
                {currentModel.name}
              </span>
              <span className="text-[11px] text-white/50 block">
                {currentModel.provider} · {currentModel.description}
              </span>
              {currentModel.supportsTools && (
                <span className="text-[11px] text-green-400 block mt-1">
                  ⚡ Supports streaming
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* System Prompt */}
      <div className="bg-white/5 rounded-lg overflow-hidden mb-3">
        <div className="px-4 py-2.5 border-b border-white/5 flex justify-between items-center">
          <div>
            <span className="text-[11px] font-medium text-white/40 uppercase tracking-wide block">
              System Prompt
            </span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={handleResetPrompt}
              className="px-2 py-1 text-[11px] bg-white/10 hover:bg-white/15 text-white/70 rounded transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSavePrompt}
              disabled={updateSettings.isPending}
              className="px-2.5 py-1 text-[11px] bg-blue-500 hover:bg-blue-400 disabled:bg-white/10 text-white rounded transition-colors"
            >
              {promptSaved ? '✓ Saved' : updateSettings.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="p-3">
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full h-48 px-3 py-2 bg-black/30 border border-white/10 rounded-md text-[12px] text-white placeholder-white/30 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 font-mono leading-relaxed selectable"
            placeholder="Enter system prompt for app generation..."
          />
          <p className="text-[11px] text-white/40 mt-2">
            Guides the AI to follow Apple Human Interface Guidelines for consistent design.
          </p>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="bg-white/5 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/5">
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-wide">
            Advanced Options
          </span>
        </div>

        <div className="divide-y divide-white/5">
          <div className="flex justify-between items-center px-4 py-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] text-white/90">Thinking Display</span>
              <span className="text-[11px] text-white/40">Show AI reasoning process</span>
            </div>
            <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-[10px] font-medium">
              Soon
            </span>
          </div>

          <div className="flex justify-between items-center px-4 py-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] text-white/90">Bring Your Own Key</span>
              <span className="text-[11px] text-white/40">Use your own API keys</span>
            </div>
            <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-[10px] font-medium">
              Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
