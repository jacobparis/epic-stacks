import * as Sentry from '@sentry/react'
import React from 'react'
import {
	createRoutesFromChildren,
	matchRoutes,
	useLocation,
	useNavigationType,
} from 'react-router'

export function init() {
	Sentry.init({
		dsn: ENV.SENTRY_DSN,
		environment: ENV.MODE,
		beforeSend(event) {
			// Check if it is an exception, and if so, show the report dialog
			if (
				event.exception &&
				event.exception.values?.[0]?.type !== 'SentryError'
			) {
				Sentry.showReportDialog({ eventId: event.event_id })
			}
			return event
		},
		integrations: [
			Sentry.replayIntegration(),
			Sentry.browserProfilingIntegration(),
			Sentry.reactRouterV7BrowserTracingIntegration({
				useEffect: React.useEffect,
				useLocation,
				useNavigationType,
				createRoutesFromChildren,
				matchRoutes,
			}),
		],

		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0,

		// Capture Replay for 10% of all sessions,
		// plus for 100% of sessions with an error
		replaysSessionSampleRate: 0.1,
		replaysOnErrorSampleRate: 1.0,
	})
}
