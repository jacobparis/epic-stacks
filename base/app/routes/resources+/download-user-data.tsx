import { invariantResponse } from '@epic-web/invariant'
import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/download-user-data.ts'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = request.headers.get('X-User-ID')
	invariantResponse(userId, 'User ID is required')

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			email: true,
			username: true,
			createdAt: true,
			updatedAt: true,
		},
	})

	invariantResponse(user, 'User not found', { status: 404 })

	return new Response(JSON.stringify(user, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Content-Disposition': 'attachment; filename="user-data.json"',
		},
	})
}
