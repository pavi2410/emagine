import { createFileRoute } from '@tanstack/react-router'
import { ResponsiveDesktop } from '../components/ResponsiveDesktop'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <ResponsiveDesktop />
}
