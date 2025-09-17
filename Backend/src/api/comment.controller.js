const express = require('express');
const CommentService = require('../services/comment.service');
const { 
    validateComment, 
    validateCommentUpdate, 
    validateNovelComments,
    validateReplies
} = require('../middleware/comment.validation');
const { authJWT } = require('../middleware/authJWT');
const { HTTP_STATUS, API_STATUS } = require('../utils/constants');

const router = express.Router();

// Create a new comment
router.post('/',
    authJWT,
    validateComment,
    async (req, res, next) => {
        try {
            const comment = await CommentService.createComment(
                req.body, 
                req.user.id
            );
            
            res.status(HTTP_STATUS.CREATED).json({
                status: API_STATUS.SUCCESS,
                data: comment
            });
        } catch (error) {
            next(error);
        }
    }
);

// Get all comments for a novel
router.get('/novel/:novelId',
    validateNovelComments,
    async (req, res, next) => {
        try {
            const comments = await CommentService.getNovelComments(
                req.params.novelId,
                req.query
            );
            
            res.status(HTTP_STATUS.OK).json({
                status: API_STATUS.SUCCESS,
                data: comments
            });
        } catch (error) {
            next(error);
        }
    }
);

// Get a single comment by ID with its replies
router.get('/:commentId',
    async (req, res, next) => {
        try {
            const comment = await CommentService.getCommentById(req.params.commentId);
            
            res.status(HTTP_STATUS.OK).json({
                status: API_STATUS.SUCCESS,
                data: comment
            });
        } catch (error) {
            next(error);
        }
    }
);

// Get replies for a comment
router.get('/:commentId/replies',
    validateReplies,
    async (req, res, next) => {
        try {
            const replies = await CommentService.getReplies(
                req.params.commentId,
                req.query
            );
            
            res.status(HTTP_STATUS.OK).json({
                status: API_STATUS.SUCCESS,
                data: replies
            });
        } catch (error) {
            next(error);
        }
    }
);

// Update a comment
router.put('/:commentId',
    authJWT,
    validateCommentUpdate,
    async (req, res, next) => {
        try {
            const comment = await CommentService.updateComment(
                req.params.commentId,
                req.body.content,
                req.user.id
            );
            
            res.status(HTTP_STATUS.OK).json({
                status: API_STATUS.SUCCESS,
                data: comment
            });
        } catch (error) {
            next(error);
        }
    }
);

// Delete a comment
router.delete('/:commentId',
    authJWT,
    async (req, res, next) => {
        try {
            const result = await CommentService.deleteComment(
                req.params.commentId,
                req.user.id
            );
            
            res.status(HTTP_STATUS.OK).json({
                status: API_STATUS.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;