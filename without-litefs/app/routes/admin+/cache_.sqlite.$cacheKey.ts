import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { cache } from '#app/utils/cache.server.ts'
import { requireUserWithRole } from '#app/utils/permissions.server.ts'

export async function loader({ request, params }: LoaderFunctionArgs) {
	await requireUserWithRole(request, 'admin')

	const { cacheKey } = params
	invariantResponse(cacheKey, 'cacheKey is required')
	return json({
		cacheKey,
		value: cache.get(cacheKey),
	})
}
