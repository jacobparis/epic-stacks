// Do not add any other lines of code to this file!
import '@total-typescript/ts-reset/dom'

/// <reference types="@playwright/test" />

declare module '@playwright/test' {
	interface TestFixtures {
		db: {
			exec: (sql: string) => Promise<void>
		}
	}
}
