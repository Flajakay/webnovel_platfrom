#!/usr/bin/env node

/**
 * Test script for the logging system
 * Run this to verify that logs are being created correctly
 */

const logger = require('./src/utils/logger');
const path = require('path');
const fs = require('fs');

console.log('Testing logging system...');
console.log('Current working directory:', process.cwd());

// Test different log levels
logger.info('Test info message');
logger.warn('Test warning message');
logger.error('Test error message');
logger.debug('Test debug message');

// Test structured logging
logger.logAPIError(new Error('Test API error'), {
	method: 'GET',
	url: '/test',
	params: {},
	query: {},
	user: { id: 'test-user' }
});

logger.logDBError(new Error('Test database error'), 'test operation');

logger.logSecurityEvent('test-event', { id: 'test-user' }, { ip: '127.0.0.1' });

// Check if log files were created
setTimeout(() => {
	const logsDir = path.join(process.cwd(), 'logs');
	console.log('\nChecking log directory:', logsDir);
	
	if (fs.existsSync(logsDir)) {
		const logDirs = fs.readdirSync(logsDir)
			.filter(item => fs.statSync(path.join(logsDir, item)).isDirectory())
			.sort()
			.reverse();
		
		if (logDirs.length > 0) {
			const latestLogDir = path.join(logsDir, logDirs[0]);
			console.log('Latest log directory:', latestLogDir);
			
			const logFiles = fs.readdirSync(latestLogDir);
			console.log('Log files created:', logFiles);
			
			// Check if files have content
			logFiles.forEach(file => {
				const filePath = path.join(latestLogDir, file);
				if (fs.existsSync(filePath)) {
					const stats = fs.statSync(filePath);
					console.log(`${file}: ${stats.size} bytes`);
				}
			});
		} else {
			console.log('No log directories found');
		}
	} else {
		console.log('Logs directory does not exist');
	}
	
	console.log('\nLogging test completed');
	process.exit(0);
}, 2000);
