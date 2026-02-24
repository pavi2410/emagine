import { createFileRoute } from '@tanstack/react-router'
import { AppViewer } from '../components/AppViewer/AppViewer'
import { HeadContent } from '@tanstack/react-router'

export const Route = createFileRoute('/a/$appId')({
  component: AppRoute,
  head: ({ params }) => {
    return {
      links: [
        {
          rel: 'manifest',
          href: `/api/manifest/${params.appId}`,
        },
      ],
    }
  },
})

function AppRoute() {
  const { appId } = Route.useParams()

  return (
    <>
      <HeadContent />
      <AppViewer appId={appId} />
    </>
  )
}
