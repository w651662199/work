module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
	},
	// required to lint *.vue files
	plugins: [
		'html'
	],
	'rules': {
		"indent": ["error", "tab"],
		"semi": ["error", "always"],
		"space-before-function-paren": ["error", "never"],
		"no-unused-vars": ["off"],
		"space-infix-ops": ["error", {"int32Hint": true}],
		"space-before-blocks": ["error", "always"],
		"comma-spacing": ["error", {"before": false, "after": true}],
		"arrow-spacing": ["error", {"before": true, "after": true}],
		"no-extend-native": ["error", {
			"exceptions": ["Object", "Date", "String", "Array", "Function"]
		}],
		"no-unneeded-ternary": ["error", {
			"defaultAssignment": false
		}],
		'arrow-parens': 0,
		'import/no-unresolved': 0,
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
	}
}
