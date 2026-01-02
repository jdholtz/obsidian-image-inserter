import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";

const tsFiles = ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"];

export default [
	{
		ignores: ["node_modules/", "main.js"],
	},
	{
		files: tsFiles,
		...js.configs.recommended,
	},
	...tseslint.configs["flat/recommended-type-checked"].map((config) => ({
		...config,
		files: tsFiles,
	})),
	{
		files: tsFiles,
		languageOptions: {
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: process.cwd(),
			},
		},
	},
	{
		files: tsFiles,
		rules: {
			"@typescript-eslint/require-await": "off",
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
			"@typescript-eslint/ban-ts-comment": "off",
			"no-prototype-builtins": "off",
			"@typescript-eslint/no-empty-function": "off"
		},
	},
];
