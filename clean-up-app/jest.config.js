module.exports = {
	verbose: true,
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.vue$': '@vue/vue2-jest',
		'^.+\\.js$': 'babel-jest'
	},
	transformIgnorePatterns: ['/node_modules/(?!(@vue|vue-firestore)/)'],
	moduleFileExtensions: ['js', 'json', 'vue'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1'
	},
	setupFilesAfterEnv: ['<rootDir>/tests/unit/setup.js'],
	testMatch: ['**/tests/unit/**/*.spec.js'],
	collectCoverageFrom: [
		'src/**/*.{js,vue}',
		'!src/main.js',
		'!src/router/index.js',
		'!src/firebase.js',
		'!**/node_modules/**'
	]
};
