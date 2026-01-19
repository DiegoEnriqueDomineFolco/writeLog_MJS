## writeLog_MJS
writeLog The writeLog function is a flexible and advanced logging utility, designed to help you record events, messages, and objects during the execution of Node.js scripts in the project. Its use is completely independent from the autotesting scripts, so it can be leveraged in any context where traceability or debugging is needed.

## TOOLS: `writeLog`

The `writeLog` function is a standalone logging utility for Node.js scripts in this repository. It is designed to help developers record events, messages, and objects in a consistent and readable way, regardless of the script or context.

### Features

- **Flexible input:** Log any type of data (strings, objects, arrays, etc.), automatically serialized for readability.
- **Timestamped entries:** Each log entry includes an ISO timestamp for easy chronological tracing.
- **Multiple arguments:** Supports logging several values in a single call.
- **Dynamic log file naming:**  
  - If `liveMode` is `true`, logs are written to `debug_live_TIMESTAMP.log`.
  - If `liveMode` is `false` (default), logs are written to `debug_TIMESTAMP.log`.
  - The timestamp can be globally set via `globalThis.ISO_EXEC_TIMESTAMP`.
- **Safe for concurrent use:** Prevents write conflicts in Node.js scripts.
- **Error fallback:** If file writing fails, the log is printed to standard error.

### Usage

```mjs
import { writeLog } from './utils.mjs';

writeLog(false, 'Process started', { user: 'admin', action: 'login' });
writeLog(true, 'Live mode enabled', operationResult);
```

### When to use

- Debugging custom scripts, helpers, migrations, or any automated process.
- Centralizing and standardizing log output across the project.
- Reviewing past executions with organized, consistent logs.

**This function is available to all developers and is recommended for any script where advanced traceability or debugging is required.**


```mjs
//HERE IS THE CODE

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
```
