import { execSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

const escapeRegExp = (string) =>
	string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getRandomString = (length) => crypto.randomBytes(length).toString('hex')
const getRandomString32 = () => getRandomString(32)

async function getEpicStackVersion() {
	const response = await fetch(
		'https://api.github.com/repos/epicweb-dev/epic-stack/commits/main',
	)
	if (!response.ok) {
		throw new Error(
			`Failed to fetch Epic Stack version: ${response.status} ${response.statusText}`,
		)
	}
	const data = await response.json()
	return {
		head: data.sha,
		date: data.commit.author.date,
	}
}

export default async function main({ rootDirectory }) {
	const FLY_TOML_PATH = path.join(rootDirectory, 'fly.toml')
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

	// Add Epic Stack version information
	try {
		const epicStackVersion = await getEpicStackVersion()
		packageJson['epic-stack'] = epicStackVersion
	} catch (error) {
		console.warn(
			'Failed to fetch Epic Stack version information. The package.json will not include version details.',
			error,
		)
	}

	const fileOperationPromises = [
		fs.writeFile(FLY_TOML_PATH, newFlyTomlContent),
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

async function setupDeployment({ rootDirectory }) {
	const APP_NAME = path.basename(rootDirectory)
	const primaryRegion = 'lhr'

	console.log(`🚀 Setting up deployment for ${APP_NAME}`)

	// create apps
	console.log(`📦 Creating apps`)
	await $I`fly apps create ${APP_NAME}-staging --org epic-web`
	await $I`fly apps create ${APP_NAME} --org epic-web`

	// create secrets
	console.log(`🔑 Creating secrets`)
	await $I`fly secrets set SESSION_SECRET=${getRandomString32()} INTERNAL_COMMAND_TOKEN=${getRandomString32()} HONEYPOT_SECRET=${getRandomString32()} ALLOW_INDEXING=false --app ${APP_NAME}-staging`
	await $I`fly secrets set SESSION_SECRET=${getRandomString32()} INTERNAL_COMMAND_TOKEN=${getRandomString32()} HONEYPOT_SECRET=${getRandomString32()} --app ${APP_NAME}`

	console.log(`🔊 Creating volumes.`)
	await $I`fly volumes create data --region ${primaryRegion} --size 1 --yes --app ${APP_NAME}-staging`
	await $I`fly volumes create data --region ${primaryRegion} --size 1 --yes --app ${APP_NAME}`

	// attach consul
	console.log(`🔗 Attaching consul`)
	await $I`fly consul attach --app ${APP_NAME}-staging`
	await $I`fly consul attach --app ${APP_NAME}`

	console.log(`🗄️ Setting up Tigris object storage`)
	await $I`fly storage create --yes --app ${APP_NAME}-staging`
	await $I`fly storage create --yes --app ${APP_NAME}`

	const { shouldDeploy } = await inquirer.prompt([
		{
			name: 'shouldDeploy',
			type: 'confirm',
			message: 'Would you like to deploy now?',
			default: true,
		},
	])

	if (shouldDeploy) {
		console.log(`🚀 Deploying`)
		await $I`fly deploy --app ${APP_NAME}-staging`
		await $I`fly deploy --app ${APP_NAME}`
	}

	console.log(
		`
Deployment setup is complete. You're now ready to deploy 🚀

What's next?

- Deploy with \`fly deploy\`
- Monitor your app with \`fly status\`
- View logs with \`fly logs\`
		`.trim(),
	)
}
