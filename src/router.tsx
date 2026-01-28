import { createRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1c1c1e] text-white">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-white/60 mb-4">The page you're looking for doesn't exist.</p>
      <a href="/" className="text-blue-500 hover:underline">Go back home</a>
    </div>
  )
}

// Create a new router instance with TanStack Query integration
export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 30, // 30 seconds
        refetchOnWindowFocus: false,
      },
    },
  })

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: { queryClient },
    defaultNotFoundComponent: NotFound,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}
