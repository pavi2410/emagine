import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { signIn, signUp } from '../../lib/auth-client'
import { UserAvatar } from './UserAvatar'
import { getWallpaperStyle } from '../OOBE/data/wallpapers'

interface SignInScreenProps {
  onSuccess?: () => void
}

type Mode = 'signin' | 'signup'

const REMEMBERED_EMAIL_KEY = 'emagine_remembered_email'
const REMEMBERED_NAME_KEY = 'emagine_remembered_name'

export function SignInScreen({ onSuccess }: SignInScreenProps) {
  const [mode, setMode] = useState<Mode>('signin')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [unlockState, setUnlockState] = useState<'locked' | 'unlocking' | 'unlocked'>('locked')

  // Check for remembered user
  const rememberedEmail = typeof window !== 'undefined' ? localStorage.getItem(REMEMBERED_EMAIL_KEY) : null
  const rememberedName = typeof window !== 'undefined' ? localStorage.getItem(REMEMBERED_NAME_KEY) : null

  useEffect(() => {
    if (rememberedEmail) {
      setEmail(rememberedEmail)
    }
  }, [rememberedEmail])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn.email({ email, password })
      if (result.error) {
        setError(result.error.message || 'Sign in failed')
        setIsLoading(false)
      } else {
        // Remember user
        localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
        // Trigger unlock animation
        setUnlockState('unlocking')
        setTimeout(() => {
          setUnlockState('unlocked')
          setTimeout(() => {
            onSuccess?.()
          }, 400)
        }, 500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
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
        setIsLoading(false)
      } else {
        // Remember user
        localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
        localStorage.setItem(REMEMBERED_NAME_KEY, name)
        // Trigger unlock animation
        setUnlockState('unlocking')
        setTimeout(() => {
          setUnlockState('unlocked')
          setTimeout(() => {
            onSuccess?.()
          }, 400)
        }, 500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
      setIsLoading(false)
    }
  }

  const handleSwitchUser = () => {
    localStorage.removeItem(REMEMBERED_EMAIL_KEY)
    localStorage.removeItem(REMEMBERED_NAME_KEY)
    setEmail('')
    setPassword('')
  }

  const switchMode = (newMode: Mode) => {
    setMode(newMode)
    setError(null)
    setPassword('')
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{
        opacity: unlockState === 'unlocked' ? 0 : 1,
        scale: unlockState === 'unlocked' ? 1.1 : 1,
        filter: unlockState === 'unlocked' ? 'blur(20px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.4 }}
    >
      {/* Blurred wallpaper background */}
      <div
        className="absolute inset-0 scale-110"
        style={{
          ...getWallpaperStyle('gradient-purple'),
          filter: 'blur(60px) brightness(0.4)',
        }}
      />

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div
        className="flex flex-col items-center justify-center relative z-10 min-h-screen p-4"
      >
        <AnimatePresence mode="wait">
          {mode === 'signin' ? (
            <SignInForm
              key="signin"
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              rememberedEmail={rememberedEmail}
              rememberedName={rememberedName}
              isLoading={isLoading}
              error={error}
              unlockState={unlockState}
              onSubmit={handleSignIn}
              onSwitchToSignup={() => switchMode('signup')}
              onSwitchUser={handleSwitchUser}
            />
          ) : (
            <SignUpForm
              key="signup"
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              name={name}
              setName={setName}
              isLoading={isLoading}
              error={error}
              unlockState={unlockState}
              onSubmit={handleSignUp}
              onSwitchToSignin={() => switchMode('signin')}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

interface SignInFormProps {
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  rememberedEmail: string | null
  rememberedName: string | null
  isLoading: boolean
  error: string | null
  unlockState: 'locked' | 'unlocking' | 'unlocked'
  onSubmit: (e: React.FormEvent) => void
  onSwitchToSignup: () => void
  onSwitchUser: () => void
}

function SignInForm({
  email,
  setEmail,
  password,
  setPassword,
  rememberedEmail,
  rememberedName,
  isLoading,
  error,
  unlockState,
  onSubmit,
  onSwitchToSignup,
  onSwitchUser,
}: SignInFormProps) {
  const hasRememberedUser = !!rememberedEmail

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: unlockState === 'unlocking' ? [1, 1.05, 1] : 1,
        opacity: 1,
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
      className="flex flex-col items-center gap-6 w-full max-w-xs"
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
      >
        <UserAvatar
          name={rememberedName || undefined}
          email={rememberedEmail || undefined}
          size="xl"
          className="ring-4 ring-white/20 shadow-2xl"
        />
      </motion.div>

      {/* Username display or email input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        {hasRememberedUser ? (
          <span className="text-xl font-medium text-white">
            {rememberedName || rememberedEmail?.split('@')[0]}
          </span>
        ) : (
          <span className="text-2xl font-bold text-white">
            Sign In
          </span>
        )}
      </motion.div>

      {/* Form */}
      <form onSubmit={onSubmit} className="w-full space-y-4">
        {!hasRememberedUser && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              className="w-full bg-white/10 border-white/20"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={error ? { x: [0, -10, 10, -10, 10, 0] } : { y: 0, opacity: 1 }}
          transition={error ? { duration: 0.4 } : { delay: hasRememberedUser ? 0.25 : 0.3 }}
        >
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
            className="w-full bg-white/10 border-white/20"
          />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-sm text-red-500 block text-center">
              {error}
            </span>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: hasRememberedUser ? 0.3 : 0.35 }}
        >
          <Button
            type="submit"
            size="3"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </motion.div>
      </form>

      {/* Bottom links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4"
      >
        {hasRememberedUser && (
          <Button variant="ghost" size="2" onClick={onSwitchUser}>
            Switch User
          </Button>
        )}
        <Button variant="ghost" size="2" onClick={onSwitchToSignup}>
          Create Account
        </Button>
      </motion.div>
    </motion.div>
  )
}

interface SignUpFormProps {
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  name: string
  setName: (name: string) => void
  isLoading: boolean
  error: string | null
  unlockState: 'locked' | 'unlocking' | 'unlocked'
  onSubmit: (e: React.FormEvent) => void
  onSwitchToSignin: () => void
}

function SignUpForm({
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  isLoading,
  error,
  unlockState,
  onSubmit,
  onSwitchToSignin,
}: SignUpFormProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: unlockState === 'unlocking' ? [1, 1.05, 1] : 1,
        opacity: 1,
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
      className="flex flex-col items-center gap-6 w-full max-w-xs"
    >
      {/* Avatar placeholder */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
      >
        <UserAvatar
          name={name || undefined}
          size="xl"
          className="ring-4 ring-white/20 shadow-2xl"
        />
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-2xl font-bold text-white">
          Create Account
        </span>
      </motion.div>

      {/* Form */}
      <form onSubmit={onSubmit} className="w-full space-y-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            className="w-full bg-white/10 border-white/20"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            className="w-full bg-white/10 border-white/20"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={error ? { x: [0, -10, 10, -10, 10, 0] } : { y: 0, opacity: 1 }}
          transition={error ? { duration: 0.4 } : { delay: 0.35 }}
        >
          <Input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full bg-white/10 border-white/20"
          />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-sm text-red-500 block text-center">
              {error}
            </span>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            type="submit"
            size="3"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </motion.div>
      </form>

      {/* Bottom links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button variant="ghost" size="2" onClick={onSwitchToSignin}>
          Already have an account? Sign In
        </Button>
      </motion.div>
    </motion.div>
  )
}
