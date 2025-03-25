import { type ActionFunctionArgs } from 'react-router'
import { cache } from '#app/utils/cache.server.ts'

export async function loader() {
	const cacheKeys = await cache.getKeys()
	return { cacheKeys }
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	const intent = formData.get('intent')
	switch (intent) {
		case 'clear': {
			await cache.clear()
			return { success: true }
		}
		default: {
			throw new Error(`Unknown intent: ${intent}`)
		}
	}
}
