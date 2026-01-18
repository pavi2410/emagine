import { useState } from 'react'
import { Box, Button, Flex, Text, TextField, Tabs } from '@radix-ui/themes'
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
    <Flex
      align="center"
      justify="center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
      }}
    >
      <Box
        className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-slate-700"
        style={{ width: '400px', maxWidth: '90vw' }}
      >
        <Flex direction="column" align="center" gap="4" className="mb-6">
          <Text size="8" className="text-white font-bold">
            emagine
          </Text>
          <Text size="2" className="text-slate-400 text-center">
            The AI-powered generative desktop
          </Text>
        </Flex>

        <Tabs.Root defaultValue="signin">
          <Tabs.List className="mb-4">
            <Tabs.Trigger value="signin">Sign In</Tabs.Trigger>
            <Tabs.Trigger value="signup">Sign Up</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="signin">
            <form onSubmit={handleSignIn}>
              <Flex direction="column" gap="3">
                <Box>
                  <Text size="2" className="text-slate-400 mb-1 block">
                    Email
                  </Text>
                  <TextField.Root
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Box>

                <Box>
                  <Text size="2" className="text-slate-400 mb-1 block">
                    Password
                  </Text>
                  <TextField.Root
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Box>

                {error && (
                  <Text size="2" color="red">
                    {error}
                  </Text>
                )}

                <Button type="submit" size="3" disabled={isLoading} className="mt-2">
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Flex>
            </form>
          </Tabs.Content>

          <Tabs.Content value="signup">
            <form onSubmit={handleSignUp}>
              <Flex direction="column" gap="3">
                <Box>
                  <Text size="2" className="text-slate-400 mb-1 block">
                    Name
                  </Text>
                  <TextField.Root
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Box>

                <Box>
                  <Text size="2" className="text-slate-400 mb-1 block">
                    Email
                  </Text>
                  <TextField.Root
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Box>

                <Box>
                  <Text size="2" className="text-slate-400 mb-1 block">
                    Password
                  </Text>
                  <TextField.Root
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </Box>

                {error && (
                  <Text size="2" color="red">
                    {error}
                  </Text>
                )}

                <Button type="submit" size="3" disabled={isLoading} className="mt-2">
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </Flex>
            </form>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Flex>
  )
}
