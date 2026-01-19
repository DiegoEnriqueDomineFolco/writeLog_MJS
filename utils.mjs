import fs from "fs";
import path from "path";

/**
 * Appends a log entry to debug.log in the project root.
 * Serializes objects, supports multiple arguments, and adds a timestamp.
 * Safe for concurrent use in Node.js scripts (e.g., Babel, helpers, etc).
 *
 * Will generate a default log file in the current working directory.
 * If liveMode = true logs will go to: debug_live_TIMESTAMP.log
 * else logs will go to a different file: debug_TIMESTAMP.log.
 * @param  {...any} args - Any values to log (strings, objects, etc)
 * 
 * using globalThis.ISO_EXEC_TIMESTAMP if available for timestamped log filenames
 */
export function writeLog(liveMode = false, ...args) {
	let logFile;
	try {
		// Switch log file depending on liveMode
		// Using global ISO_EXEC_TIMESTAMP if available
		switch (liveMode) {
			case true:
				logFile = `debug_live_${globalThis.ISO_EXEC_TIMESTAMP || 'default'}.log`;
				break;
			default:
				logFile = `debug_${globalThis.ISO_EXEC_TIMESTAMP || 'default'}.log`;
		}

		const logPath = path.join(process.cwd(), logFile);
		const timestamp = new Date().toISOString();
		const message = args.map(a =>
			typeof a === 'string' ? a : JSON.stringify(a, null, 2)
		).join(' ') + '\n';
		fs.appendFileSync(logPath, `\n\n[${timestamp}] ${message}`);
	} catch (err) {
		// Fallback: print to stderr if file write fails
		console.error('writeLog error:', err);
	}
}
