import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs } from 'react-router'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ params }: LoaderFunctionArgs) {
	const image = await prisma.noteImage.findUnique({
		where: { id: params.imageId },
		select: { blob: true, contentType: true },
	})

	invariantResponse(image, 'Not found', { status: 404 })

	return new Response(image.blob, {
		headers: {
			'Content-Type': image.contentType,
			'Content-Length': Buffer.byteLength(image.blob).toString(),
			'Content-Disposition': 'inline',
		},
	})
}
