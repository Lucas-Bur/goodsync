import { createFileRoute } from '@tanstack/react-router'
import { prepareElectricUrl, proxyElectricRequest } from '@/lib/electric-proxy'

const serve = async ({ request }: { request: Request }) => {
  // const session = await auth.api.getSession({ headers: request.headers })
  // if (!session) {
  //   return new Response(JSON.stringify({ error: `Unauthorized` }), {
  //     status: 401,
  //     headers: { 'content-type': `application/json` },
  //   })
  // }

  const originUrl = prepareElectricUrl(request.url)

  // tbh, this sucks
  originUrl.searchParams.set(`table`, `users_table`)

  return proxyElectricRequest(originUrl)
}

export const Route = createFileRoute('/api/users')({
  server: {
    handlers: {
      GET: serve,
    },
  },
})
