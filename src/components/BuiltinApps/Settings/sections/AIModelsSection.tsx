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
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 text-white">
        AI Models
      </h2>

      {/* Model Selection */}
      <div className="bg-slate-800/50 rounded-xl p-5 mb-4">
        <h3 className="text-base font-medium mb-4 text-slate-300">
          Generation Model
        </h3>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              Select Model
            </label>
            <select
              value={settings?.selectedModel || ''}
              onChange={(e) => updateSettings.mutate({ selectedModel: e.target.value as ModelId })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {Object.entries(AVAILABLE_MODELS).map(([id, model]) => (
                <option key={id} value={id}>
                  {model.name}
                  {model.supportsTools && ' ⚡'}
                </option>
              ))}
            </select>
          </div>

          {/* Model Info Card */}
          {currentModel && (
            <div className="bg-slate-700/50 rounded-lg p-4">
              <span className="text-sm font-medium block mb-1 text-white">
                {currentModel.name}
              </span>
              <span className="text-xs text-slate-400 block mb-1">
                Provider: {currentModel.provider}
              </span>
              <span className="text-xs text-slate-400 block">
                {currentModel.description}
              </span>
              {currentModel.supportsTools && (
                <span className="text-xs text-green-400 block mt-2">
                  ⚡ Supports streaming tools
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* System Prompt */}
      <div className="bg-slate-800/50 rounded-xl p-5 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-base font-medium text-slate-300">
              System Prompt
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Instructions for building apps with consistent UI/UX design
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleResetPrompt}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
            >
              Reset to Default
            </button>
            <button
              onClick={handleSavePrompt}
              disabled={updateSettings.isPending}
              className="px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white rounded-lg transition-colors"
            >
              {promptSaved ? '✓ Saved' : updateSettings.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="w-full h-64 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono leading-relaxed selectable"
          placeholder="Enter system prompt for app generation..."
        />

        <p className="text-xs text-slate-500 mt-2">
          This prompt guides the AI to follow Apple Human Interface Guidelines for consistent, high-quality app design.
        </p>
      </div>

      {/* Advanced Options */}
      <div className="bg-slate-800/50 rounded-xl p-5">
        <h3 className="text-base font-medium mb-4 text-slate-300">
          Advanced Options
        </h3>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-white">Enable Thinking Display</span>
              <span className="text-xs text-slate-500">Show AI reasoning process</span>
            </div>
            <span className="bg-orange-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
              Coming Soon
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-white">Bring Your Own Key (BYOK)</span>
              <span className="text-xs text-slate-500">Use your own API keys</span>
            </div>
            <span className="bg-orange-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
