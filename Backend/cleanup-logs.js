#!/usr/bin/env node

/**
 * Log cleanup script
 * Removes log directories older than specified days
 */

const fs = require('fs');
const path = require('path');

const DAYS_TO_KEEP = 7; // Keep logs for 7 days
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const cleanupLogs = () => {
	const logsDir = path.join(process.cwd(), 'logs');
	
	if (!fs.existsSync(logsDir)) {
		console.log('Logs directory does not exist');
		return;
	}
	
	const now = Date.now();
	const cutoffTime = now - (DAYS_TO_KEEP * MS_PER_DAY);
	
	console.log(`Cleaning up logs older than ${DAYS_TO_KEEP} days...`);
	
	const items = fs.readdirSync(logsDir);
	let removedCount = 0;
	let totalSize = 0;
	
	items.forEach(item => {
		const itemPath = path.join(logsDir, item);
		const stats = fs.statSync(itemPath);
		
		// Skip non-directories and special files
		if (!stats.isDirectory() || item === 'latest' || item.endsWith('.txt')) {
			return;
		}
		
		// Check if directory name looks like a timestamp
		const timestampMatch = item.match(/(\d{4}-\d{2}-\d{2})/);
		if (!timestampMatch) {
			console.log(`Skipping non-timestamp directory: ${item}`);
			return;
		}
		
		// Use directory creation time as fallback
		const dirTime = stats.ctimeMs;
		
		if (dirTime < cutoffTime) {
			try {
				// Calculate size before removal
				const size = getDirSize(itemPath);
				totalSize += size;
				
				// Remove directory recursively
				fs.rmSync(itemPath, { recursive: true, force: true });
				console.log(`Removed: ${item} (${formatBytes(size)})`);
				removedCount++;
			} catch (error) {
				console.error(`Failed to remove ${item}:`, error.message);
			}
		}
	});
	
	console.log(`Cleanup completed: ${removedCount} directories removed, ${formatBytes(totalSize)} freed`);
};

const getDirSize = (dirPath) => {
	let totalSize = 0;
	
	const calculateSize = (currentPath) => {
		const items = fs.readdirSync(currentPath);
		
		items.forEach(item => {
			const itemPath = path.join(currentPath, item);
			const stats = fs.statSync(itemPath);
			
			if (stats.isDirectory()) {
				calculateSize(itemPath);
			} else {
				totalSize += stats.size;
			}
		});
	};
	
	try {
		calculateSize(dirPath);
	} catch (error) {
		console.error(`Error calculating size for ${dirPath}:`, error.message);
	}
	
	return totalSize;
};

const formatBytes = (bytes) => {
	if (bytes === 0) return '0 Bytes';
	
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Run cleanup
cleanupLogs();
