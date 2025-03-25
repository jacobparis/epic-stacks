import { invariantResponse } from '@epic-web/invariant'
import { lruCache } from '#app/utils/cache.server.ts'
import { requireUserWithRole } from '#app/utils/permissions.server.ts'
import { type Route } from './+types/cache_.lru.$cacheKey.ts'

export async function loader({ request, params }: Route.LoaderArgs) {
	await requireUserWithRole(request, 'admin')
	const { cacheKey } = params
	invariantResponse(cacheKey, 'Cache key is required')
	return {
		value: await lruCache.get(cacheKey),
	}
}

export async function action({ params, request }: Route.ActionArgs) {
	const { cacheKey } = params
	invariantResponse(cacheKey, 'Cache key is required')
	const formData = await request.formData()
	const intent = formData.get('intent')
	switch (intent) {
		case 'delete': {
			await lruCache.delete(cacheKey)
			return { success: true }
		}
		default: {
			throw new Error(`Unknown intent: ${intent}`)
		}
	}
}
