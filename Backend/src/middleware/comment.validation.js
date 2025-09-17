const { body, param, query } = require('express-validator');
const { handleValidationErrors, paginationRules } = require('./novel.validation');

// Comment creation validation
const validateComment = [
    body('content')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Comment must be between 1 and 1000 characters'),
    
    body('novelId')
        .isMongoId()
        .withMessage('Invalid novel ID format'),
    
    body('parentId')
        .optional()
        .isMongoId()
        .withMessage('Invalid parent comment ID format'),
    
    handleValidationErrors
];

// Comment update validation
const validateCommentUpdate = [
    param('commentId')
        .isMongoId()
        .withMessage('Invalid comment ID format'),
    
    body('content')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Comment must be between 1 and 1000 characters'),
    
    handleValidationErrors
];

// Comment retrieval validation for a novel
const validateNovelComments = [
    param('novelId')
        .isMongoId()
        .withMessage('Invalid novel ID format'),
    
    ...paginationRules,
    
    query('parentId')
        .optional()
        .isMongoId()
        .withMessage('Invalid parent comment ID format'),
    
    handleValidationErrors
];

// Validate parameters for comment replies
const validateReplies = [
    param('commentId')
        .isMongoId()
        .withMessage('Invalid comment ID format'),
    
    ...paginationRules,
    
    handleValidationErrors
];

module.exports = {
    validateComment,
    validateCommentUpdate,
    validateNovelComments,
    validateReplies
};