import { Link, redirect } from 'react-router'
import { requireUserId, logout } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/me.ts'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findUnique({ where: { id: userId } })
	if (!user) {
		await logout(request)
		throw redirect('/login')
	}
	return redirect(`/users/${user.username}`)
}

export default function MeRoute() {
	return (
		<div className="container">
			<h1>Me</h1>
			<Link to="/">Home</Link>
		</div>
	)
}
