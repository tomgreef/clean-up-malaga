import Vue from 'vue';
import Buefy from 'buefy';

Vue.use(Buefy);

// Polyfills for Node.js environment (required for Firebase v10)
if (typeof global.TextEncoder === 'undefined') {
	const { TextEncoder, TextDecoder } = require('util');
	global.TextEncoder = TextEncoder;
	global.TextDecoder = TextDecoder;
}

if (typeof global.ReadableStream === 'undefined') {
	const { ReadableStream } = require('stream/web');
	global.ReadableStream = ReadableStream;
}
