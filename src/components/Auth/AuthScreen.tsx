import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Tabs } from '../ui/Tabs'
import { signIn, signUp } from '../../lib/auth-client'

interface AuthScreenProps {
  onSuccess?: () => void
}

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn.email({ email, password })
      if (result.error) {
        setError(result.error.message || 'Sign in failed')
      } else {
        onSuccess?.()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signUp.email({ email, password, name })
      if (result.error) {
        setError(result.error.message || 'Sign up failed')
      } else {
        onSuccess?.()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
      }}
    >
      <div
        className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-slate-700 w-[400px] max-w-[90vw]"
      >
        <div className="flex flex-col items-center gap-4 mb-6">
          <h1 className="text-3xl text-white font-bold">
            emagine
          </h1>
          <p className="text-sm text-slate-400 text-center">
            The AI-powered generative desktop
          </p>
        </div>

        <Tabs.Root defaultValue="signin">
          <Tabs.List className="mb-4">
            <Tabs.Trigger value="signin">Sign In</Tabs.Trigger>
            <Tabs.Trigger value="signup">Sign Up</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="signin">
            <form onSubmit={handleSignIn}>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                )}

                <Button type="submit" size="3" disabled={isLoading} className="mt-2">
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </form>
          </Tabs.Content>

          <Tabs.Content value="signup">
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">
                    Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                )}

                <Button type="submit" size="3" disabled={isLoading} className="mt-2">
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  )
}
