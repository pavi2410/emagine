import { createFileRoute } from '@tanstack/react-router'
import { Desktop } from '../components/Desktop/Desktop'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <Desktop />
}
