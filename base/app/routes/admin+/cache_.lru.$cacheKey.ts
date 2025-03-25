import { invariantResponse } from '@epic-web/invariant'
import { data, type ActionFunctionArgs } from 'react-router'
import { cache } from '#app/utils/cache.server.ts'

export async function loader({ params }: ActionFunctionArgs) {
	const { cacheKey } = params
	invariantResponse(cacheKey, 'Cache key is required')
	return data({
		value: await cache.get(cacheKey),
	})
}

export async function action({ params, request }: ActionFunctionArgs) {
	const { cacheKey } = params
	invariantResponse(cacheKey, 'Cache key is required')
	const formData = await request.formData()
	const intent = formData.get('intent')
	switch (intent) {
		case 'delete': {
			await cache.delete(cacheKey)
			return data({ success: true })
		}
		default: {
			throw new Error(`Unknown intent: ${intent}`)
		}
	}
}
