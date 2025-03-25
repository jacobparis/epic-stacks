import { invariantResponse } from '@epic-web/invariant'
import { type ActionFunctionArgs } from 'react-router'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ request }: ActionFunctionArgs) {
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
