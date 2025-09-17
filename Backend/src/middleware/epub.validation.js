const {
	body,
	validationResult
} = require('express-validator');
const {
	ValidationError
} = require('../utils/errors');
const {
	NOVEL_ERRORS
} = require('../utils/constants');

const validateEpubImport = [
	// Validate import options
	body('overwrite')
	.optional()
	.isBoolean()
	.withMessage('Overwrite flag must be a boolean value'),

	body('draft')
	.optional()
	.isBoolean()
	.withMessage('Draft flag must be a boolean value'),

	body('startChapterNumber')
	.optional()
	.isInt({
		min: 1
	})
	.withMessage('Start chapter number must be a positive integer')
];

const handleEpubValidationErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const messages = errors.array().map(error => error.msg);
		throw new ValidationError(messages.join(', '));
	}

	// Check if file is present
	if (!req.file) {
		throw new ValidationError(NOVEL_ERRORS.EPUB_REQUIRED);
	}

	next();
};

module.exports = {
	validateEpubImport,
	handleEpubValidationErrors
};