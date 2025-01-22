module.exports = {
	root: true,
	env: {
		node: true,
		'vue/setup-compiler-macros': true,
	},
	extends: [
		'plugin:vue/vue3-recommended',
		'eslint:recommended',
		'@vue/typescript/recommended',
		'plugin:prettier/recommended',
	],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'vue/multi-word-component-names': 'off',
		'vue/no-v-text-v-html-on-component': 'off',
		'vue/no-v-html': 'off',
		'@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				ignoreRestSiblings: true,
			},
		],
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				semi: true,
				trailingComma: 'es5',
			},
		],
	},
};
