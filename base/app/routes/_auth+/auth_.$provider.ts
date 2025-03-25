import { redirect } from 'react-router'
import { authenticator } from '#app/utils/auth.server.ts'
import { handleMockAction } from '#app/utils/connections.server.ts'
import { ProviderNameSchema } from '#app/utils/connections.tsx'
import { getReferrerRoute } from '#app/utils/misc.tsx'
import { getRedirectCookieHeader } from '#app/utils/redirect-cookie.server.ts'
import { type Route } from './+types/auth_.$provider.ts'

export async function loader() {
	return redirect('/login')
}

export async function action({ request, params }: Route.ActionArgs) {
	const providerName = ProviderNameSchema.parse(params.provider)

	try {
		return await handleMockAction(request, providerName)
	} catch (error) {
		if (error instanceof Response) return error
		if (error instanceof Error) {
			console.error(error)
			return new Response('Internal Server Error', { status: 500 })
		}
		return new Response('Internal Server Error', { status: 500 })
	}
} 
