import Vue from 'vue';
import Buefy from 'buefy';

Vue.use(Buefy);

// Polyfills for Node.js test environment
// Required for Firebase and related dependencies that expect browser APIs
if (typeof global.TextEncoder === 'undefined') {
	const { TextEncoder, TextDecoder } = require('util');
	global.TextEncoder = TextEncoder;
	global.TextDecoder = TextDecoder;
}

if (typeof global.ReadableStream === 'undefined') {
	try {
		const { ReadableStream } = require('stream/web');
		global.ReadableStream = ReadableStream;
	} catch (e) {
		// stream/web not available in older Node.js versions
		// Tests may fail if they require ReadableStream
	}
}
