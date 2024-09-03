import RulesMFDC from '@momsfriendlydevco/eslint-config';

export default [
	{
		// Global ignore rules - Do not add any other keys to this object or eslint doesn't treat this as global
		ignores: [
			'.*',
			'dist/',
			'node_modules/',
		],
	},
	...RulesMFDC,
]
