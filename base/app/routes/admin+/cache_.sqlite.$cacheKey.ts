import { invariantResponse } from '@epic-web/invariant'
import { type ActionFunctionArgs } from 'react-router'
import { cache } from '#app/utils/cache.server.ts'
import { requireUserWithRole } from '#app/utils/permissions.server.ts'
import { type Route } from './+types/cache_.sqlite.$cacheKey.ts'

export async function loader({ request, params }: Route.LoaderArgs) {
	await requireUserWithRole(request, 'admin')
	const { cacheKey } = params
	invariantResponse(cacheKey, 'Cache key is required')
	return {
			value: await cache.get(cacheKey),
	}
}

export async function action({ params, request }: ActionFunctionArgs) {
	const { cacheKey } = params
	invariantResponse(cacheKey, 'Cache key is required')
	const formData = await request.formData()
	const intent = formData.get('intent')
	switch (intent) {
		case 'delete': {
			await cache.delete(cacheKey)
			return { success: true }
		}
		default: {
			throw new Error(`Unknown intent: ${intent}`)
		}
	}
}
