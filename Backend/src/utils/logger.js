const winston = require('winston');
const path = require('path');
const fs = require('fs');

const readableFormat = winston.format.printf(({
	level,
	message,
	timestamp,
	stack,
	...metadata
}) => {
	let log = `${timestamp} | ${level} | ${message}`;

	// Add metadata if present
	if (Object.keys(metadata).length > 0 && metadata.error !== undefined) {
		log += `\nMetadata: ${JSON.stringify(metadata, null, 2)}`;
	}

	// Add stack trace for errors
	if (stack) {
		log += `\nStack Trace:\n${stack}`;
	}

	return log;
});

const logFormat = winston.format.combine(
	winston.format.timestamp({
		format: 'YYYY-MM-DD HH:mm:ss'
	}),
	winston.format.errors({
		stack: true
	}),
	winston.format.splat(),
	readableFormat
);

const consoleFormat = winston.format.combine(
	winston.format.timestamp({
		format: 'YYYY-MM-DD HH:mm:ss'
	}),
	winston.format.errors({
		stack: true
	}),
	winston.format.splat(),
	winston.format.colorize({
		all: true
	}),
	readableFormat
);

// Helper function to safely create directories
const ensureDirectoryExists = (dirPath) => {
	try {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
		return true;
	} catch (error) {
		console.error(`Failed to create directory ${dirPath}:`, error.message);
		return false;
	}
};

// Helper function to create safe timestamp for directory names
const createSafeTimestamp = () => {
	const now = new Date();
	// Use a format that's safe for both Windows and Linux filesystems
	// Avoid colons and other problematic characters
	return now.toISOString()
		.replace(/:/g, '-')      // Replace colons with hyphens
		.replace(/\./g, '-')     // Replace dots with hyphens  
		.replace(/T/g, '_')      // Replace T with underscore for readability
		.slice(0, -1);           // Remove the 'Z' at the end
};

const logsDir = path.resolve(process.cwd(), 'logs');
const timestamp = createSafeTimestamp();
const sessionLogsDir = path.join(logsDir, timestamp);

// Create logs directory and session directory
console.log(`Creating logs directory: ${logsDir}`);
if (!ensureDirectoryExists(logsDir)) {
	console.error('Failed to create main logs directory, falling back to current directory');
	// Fallback to current directory if we can't create logs dir
	const fallbackDir = path.join(process.cwd(), 'fallback-logs');
	if (ensureDirectoryExists(fallbackDir)) {
		logsDir = fallbackDir;
		sessionLogsDir = path.join(logsDir, timestamp);
	}
}

console.log(`Creating session logs directory: ${sessionLogsDir}`);
if (!ensureDirectoryExists(sessionLogsDir)) {
	console.error('Failed to create session logs directory');
	process.exit(1);
}

// Create a symbolic link to the latest logs directory (with error handling)
const createLatestLink = () => {
	const latestLogsDir = path.join(logsDir, 'latest');
	try {
		// Check if 'latest' exists and remove it
		if (fs.existsSync(latestLogsDir)) {
			const stats = fs.lstatSync(latestLogsDir);
			if (stats.isSymbolicLink()) {
				fs.unlinkSync(latestLogsDir);
			} else if (stats.isDirectory()) {
				// If it's a directory, remove it recursively
				fs.rmSync(latestLogsDir, { recursive: true, force: true });
			} else {
				fs.unlinkSync(latestLogsDir);
			}
		}
		
		// Create relative path for symlink to make it more portable
		const relativePath = path.relative(logsDir, sessionLogsDir);
		fs.symlinkSync(relativePath, latestLogsDir, 'dir');
		console.log(`Created symbolic link: ${latestLogsDir} -> ${sessionLogsDir}`);
	} catch (error) {
		// Symbolic links might not work on all systems (Windows without admin, some Linux configs)
		console.warn(`Could not create symbolic link to latest logs: ${error.message}`);
		
		// Alternative: create a text file with the path
		try {
			const latestPathFile = path.join(logsDir, 'latest-session.txt');
			fs.writeFileSync(latestPathFile, sessionLogsDir);
			console.log(`Created latest session reference file: ${latestPathFile}`);
		} catch (writeError) {
			console.warn(`Could not create latest session reference: ${writeError.message}`);
		}
	}
};

createLatestLink();

// Define log file paths with absolute paths
const logFiles = {
	error: path.resolve(sessionLogsDir, 'error.log'),
	combined: path.resolve(sessionLogsDir, 'combined.log'),
	exceptions: path.resolve(sessionLogsDir, 'exceptions.log'),
	rejections: path.resolve(sessionLogsDir, 'rejections.log')
};

// Verify all log file directories exist
Object.values(logFiles).forEach(filePath => {
	const dir = path.dirname(filePath);
	if (!fs.existsSync(dir)) {
		console.error(`Log file directory missing: ${dir}`);
		if (!ensureDirectoryExists(dir)) {
			console.error(`Failed to create log file directory: ${dir}`);
		}
	}
});

console.log(`Log files will be created in: ${sessionLogsDir}`);
console.log(`Error log: ${logFiles.error}`);
console.log(`Combined log: ${logFiles.combined}`);

const transports = [
	// Console transport with colors
	new winston.transports.Console({
		format: consoleFormat,
		level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	}),
	// File transport for errors
	new winston.transports.File({
		filename: logFiles.error,
		level: 'error',
		format: logFormat,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		options: {
			flags: 'a' // append mode
		}
	}),
	// File transport for all logs
	new winston.transports.File({
		filename: logFiles.combined,
		format: logFormat,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		options: {
			flags: 'a' // append mode
		}
	}),
];

const logger = winston.createLogger({
	level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	format: logFormat,
	transports,
	// Handle uncaught exceptions and rejections
	exceptionHandlers: [
		new winston.transports.File({
			filename: logFiles.exceptions,
			format: logFormat,
			maxsize: 5242880, // 5MB
			maxFiles: 5,
			options: {
				flags: 'a'
			}
		}),
	],
	rejectionHandlers: [
		new winston.transports.File({
			filename: logFiles.rejections,
			format: logFormat,
			maxsize: 5242880, // 5MB
			maxFiles: 5,
			options: {
				flags: 'a'
			}
		}),
	],
	// Exit on error false to prevent the logger from exiting the process
	exitOnError: false
});

// Test that we can actually write to the log files
const testLogging = () => {
	try {
		logger.info('Logger initialized successfully');
		logger.debug('Debug logging enabled');
		return true;
	} catch (error) {
		console.error('Logger test failed:', error);
		return false;
	}
};

// Run the test
if (!testLogging()) {
	console.error('Logger initialization test failed - check file permissions and paths');
}

// Create a stream object for Morgan HTTP logging
logger.stream = {
	write: (message) => {
		try {
			logger.info(message.trim());
		} catch (error) {
			console.error('Failed to write to logger stream:', error);
		}
	},
};

// Helper methods for structured logging
logger.logAPIError = (error, req) => {
	try {
		logger.error('API Error', {
			error: {
				message: error.message,
				stack: error.stack,
			},
			request: {
				method: req.method,
				url: req.url,
				params: req.params,
				query: req.query,
				user: req.user ? req.user.id : 'anonymous',
			},
		});
	} catch (logError) {
		console.error('Failed to log API error:', logError);
		console.error('Original error:', error);
	}
};

logger.logDBError = (error, operation) => {
	try {
		logger.error(`Database Error during ${operation}`, {
			error: {
				message: error.message,
				stack: error.stack,
			},
		});
	} catch (logError) {
		console.error('Failed to log DB error:', logError);
		console.error('Original error:', error);
	}
};

logger.logSecurityEvent = (event, user, details) => {
	try {
		logger.warn(`Security Event: ${event}`, {
			user: user ? user.id : 'anonymous',
			details,
		});
	} catch (logError) {
		console.error('Failed to log security event:', logError);
	}
};

// Add cleanup function for graceful shutdown
logger.cleanup = () => {
	return new Promise((resolve) => {
		logger.end(() => {
			console.log('Logger cleanup completed');
			resolve();
		});
	});
};

module.exports = logger;