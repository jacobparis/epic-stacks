import { useSearchParams } from 'react-router'
import { Icon, type IconName } from './ui/icon'
import { Input } from './ui/input'

export function SearchBar({
	placeholder = 'Search...',
	icon = 'search',
}: {
	placeholder?: string
	icon?: IconName
}) {
	const [searchParams, setSearchParams] = useSearchParams()
	const search = searchParams.get('q') ?? ''

	return (
		<div className="relative">
			<Icon
				name={icon}
				className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input
				type="search"
				placeholder={placeholder}
				className="pl-9"
				value={search}
				onChange={(e) => {
					const value = e.target.value
					if (value) {
						setSearchParams({ q: value })
					} else {
						setSearchParams({})
					}
				}}
			/>
		</div>
	)
}
