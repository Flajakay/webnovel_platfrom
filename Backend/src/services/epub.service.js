const EpubProcessor = require('../utils/epub/epub.util');
const ChapterService = require('./chapter.service');
const Novel = require('../models/novel.model');
const {
	NotFoundError,
	ValidationError
} = require('../utils/errors');
const {
	NOVEL_ERRORS,
	CONTENT_STATUS
} = require('../utils/constants');
const logger = require('../utils/logger');

// Service for handling EPUB imports

const EpubService = {
	async importChaptersFromEpub(novelId, epubBuffer, options = {}) {
		// Check if novel exists
		const novel = await Novel.findById(novelId);
		if (!novel) {
			throw new NotFoundError(NOVEL_ERRORS.NOVEL_NOT_FOUND);
		}

		// Process the EPUB file
		const chapters = await EpubProcessor.processEpub(epubBuffer);

		// Validate chapters
		if (!chapters || chapters.length === 0) {
			throw new ValidationError(NOVEL_ERRORS.EPUB_NO_CHAPTERS);
		}

		// Get existing chapters for this novel
		const existingChaptersResult = await ChapterService.getChaptersByNovelId(novelId, {
			limit: 1000 // Get a large number to cover all chapters
		});

		const existingChapters = existingChaptersResult.chapters || [];
		const existingChapterNumbers = existingChapters.map(chapter => chapter.chapterNumber);

		// Determine starting chapter number if we're adding to existing chapters
		let startChapterNumber = 1;
		if (!options.overwrite && existingChapters.length > 0) {
			// Find the highest chapter number
			startChapterNumber = Math.max(...existingChapterNumbers) + 1;
		}
		// Import chapters
		const importResults = {
			totalChapters: chapters.length,
			imported: 0,
			skipped: 0,
			errors: []
		};

		for (let i = 0; i < chapters.length; i++) {
			const chapter = chapters[i];

			// Calculate the actual chapter number
			const chapterNumber = options.overwrite ? (i + 1) : startChapterNumber + i;
			try {
				// Check if chapter exists
				const chapterExists = existingChapterNumbers.includes(chapterNumber);

				if (chapterExists && !options.overwrite) {
					// Skip if chapter exists and we're not overwriting
					importResults.skipped++;
					continue;
				}

				// Prepare chapter data
				const chapterData = {
					chapterNumber,
					title: chapter.title,
					content: chapter.content,
					status: options.draft ? CONTENT_STATUS.DRAFT : CONTENT_STATUS.PUBLISHED
				};

				if (chapterExists) {
					// Update existing chapter
					await ChapterService.updateChapter(novelId, chapterNumber, chapterData);
				} else {
					// Create new chapter
					await ChapterService.createChapter(novelId, chapterData);
				}

				importResults.imported++;
			} catch (error) {
				logger.error(`Error importing chapter ${chapterNumber}:`, error);
				importResults.errors.push({
					chapterNumber,
					error: error.message
				});
			}
		}

		return importResults;
	}
};

module.exports = EpubService;