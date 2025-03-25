import { type ActionFunctionArgs } from 'react-router'

export function loader({ request }: ActionFunctionArgs) {
	const robotText = `
User-agent: *
Disallow: /admin/
Allow: /

Sitemap: ${new URL('/sitemap.xml', request.url)}
	`.trim()

	return new Response(robotText, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${
				60 * 60 * 24
			}`,
		},
	})
}
