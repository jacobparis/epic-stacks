import { execSync } from 'child_process'
import path from 'node:path'
import { join } from 'path'
import { fileURLToPath } from 'url'
import fsExtra from 'fs-extra'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { cleanupDb } from '#tests/db-utils.ts'
import { BASE_DATABASE_PATH } from './global-setup.ts'

const databaseFile = `./tests/prisma/data.${process.env.VITEST_POOL_ID || 0}.db`
const databasePath = path.join(process.cwd(), databaseFile)
process.env.DATABASE_URL = `file:${databasePath}`

const __dirname = fileURLToPath(new URL('.', import.meta.url))

beforeAll(async () => {
	await fsExtra.copyFile(BASE_DATABASE_PATH, databasePath)
})

// we *must* use dynamic imports here so the process.env.DATABASE_URL is set
// before prisma is imported and initialized
afterEach(async () => {
	const { prisma } = await import('#app/utils/db.server.ts')
	await cleanupDb(prisma)
})

afterAll(async () => {
	const { prisma } = await import('#app/utils/db.server.ts')
	await prisma.$disconnect()
	await fsExtra.remove(databasePath)
})

export function setup() {
	execSync('npm run db:reset', {
		stdio: 'inherit',
		cwd: join(__dirname, '../..'),
	})
}
