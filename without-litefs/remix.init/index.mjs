import { execSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

const getRandomString = (length) => crypto.randomBytes(length).toString('hex')

export default async function main({ rootDirectory }) {
	const EXAMPLE_ENV_PATH = path.join(rootDirectory, '.env.example')
	const ENV_PATH = path.join(rootDirectory, '.env')
	const PKG_PATH = path.join(rootDirectory, 'package.json')

	const DIR_NAME = path.basename(rootDirectory)
	const SUFFIX = getRandomString(2)

	const APP_NAME = (DIR_NAME + '-' + SUFFIX)
		// get rid of anything that's not allowed in an app name
		.replace(/[^a-zA-Z0-9-_]/g, '-')
		.toLowerCase()

	const [env, packageJsonString] = await Promise.all([
		fs.readFile(EXAMPLE_ENV_PATH, 'utf-8'),
		fs.readFile(PKG_PATH, 'utf-8'),
	])

	const newEnv = env.replace(
		/^SESSION_SECRET=.*$/m,
		`SESSION_SECRET="${getRandomString(16)}"`,
	)

	const packageJson = JSON.parse(packageJsonString)

	packageJson.name = APP_NAME
	delete packageJson.author
	delete packageJson.license

	const fileOperationPromises = [
		fs.writeFile(ENV_PATH, newEnv),
		fs.writeFile(PKG_PATH, JSON.stringify(packageJson, null, 2)),
		fs.copyFile(
			path.join(rootDirectory, 'remix.init', 'gitignore'),
			path.join(rootDirectory, '.gitignore'),
		),
		fs.rm(path.join(rootDirectory, 'LICENSE.md')),
		fs.rm(path.join(rootDirectory, 'CONTRIBUTING.md')),
		fs.rm(path.join(rootDirectory, 'tests/e2e/notes.test.ts')),
		fs.rm(path.join(rootDirectory, 'tests/e2e/search.test.ts')),
		fs.rm(path.join(rootDirectory, '.github/workflows/version.yml')),
	]

	await Promise.all(fileOperationPromises)

	if (!process.env.SKIP_SETUP) {
		execSync('npm run setup', { cwd: rootDirectory, stdio: 'inherit' })
	}

	if (!process.env.SKIP_FORMAT) {
		execSync('npm run format -- --log-level warn', {
			cwd: rootDirectory,
			stdio: 'inherit',
		})
	}

	console.log(
		`
Setup is complete. You're now ready to rock and roll 🐨

What's next?

- Start development with \`npm run dev\`
- Run tests with \`npm run test\` and \`npm run test:e2e\`
		`.trim(),
	)
}
