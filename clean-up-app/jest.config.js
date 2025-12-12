module.exports = {
	verbose: true,
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.vue$': '@vue/vue2-jest',
		'^.+\\.js$': 'babel-jest'
	},
	moduleFileExtensions: ['js', 'json', 'vue'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1'
	},
	setupFilesAfterEnv: ['<rootDir>/tests/unit/setup.js'],
	testMatch: ['**/tests/unit/**/*.spec.js']
};
