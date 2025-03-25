import { type ActionFunctionArgs } from 'react-router'

export function loader({ request }: ActionFunctionArgs) {
	const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${new URL('/', request.url)}</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
		<priority>1.0</priority>
	</url>
</urlset>
	`.trim()

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${
				60 * 60 * 24
			}`,
		},
	})
}
