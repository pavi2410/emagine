import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '../components/MainLayout'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <MainLayout />
}
