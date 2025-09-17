const Comment = require('../models/comment.model');
const Novel = require('../models/novel.model');
const { NotFoundError, AuthorizationError } = require('../utils/errors');
const { ERROR_MESSAGES } = require('../utils/constants');

const CommentService = {
    async createComment(commentData, userId) {
        // Verify the novel exists
        const novel = await Novel.findById(commentData.novelId);
        if (!novel) throw new NotFoundError(ERROR_MESSAGES.NOVEL_NOT_FOUND);
        
        // If this is a reply, verify parent comment exists
        if (commentData.parentId) {
            const parentComment = await Comment.findById(commentData.parentId);
            if (!parentComment) throw new NotFoundError(ERROR_MESSAGES.COMMENT_NOT_FOUND);
            if (parentComment.novelId.toString() !== commentData.novelId.toString()) {
                throw new AuthorizationError('Parent comment does not belong to the specified novel');
            }
        }
        
        const comment = await Comment.create({
            ...commentData,
            author: userId
        });
        
        // Return populated comment
        return Comment.findById(comment._id)
            .populate('author', 'username')
            .lean();
    },
    
    async getNovelComments(novelId, query = {}) {
        // Verify the novel exists
        const novel = await Novel.findById(novelId);
        if (!novel) throw new NotFoundError(ERROR_MESSAGES.NOVEL_NOT_FOUND);
        
        return Comment.getNovelComments(novelId, query);
    },
    
    async getCommentById(commentId) {
        const comment = await Comment.findById(commentId)
            .populate('author', 'username')
            .populate({
                path: 'replies',
                options: { sort: { createdAt: 1 } },
                populate: {
                    path: 'author', 
                    select: 'username'
                }
            });
            
        if (!comment) throw new NotFoundError(ERROR_MESSAGES.COMMENT_NOT_FOUND);
        return comment;
    },
    
    async updateComment(commentId, content, userId) {
        const comment = await Comment.findById(commentId);
        if (!comment) throw new NotFoundError(ERROR_MESSAGES.COMMENT_NOT_FOUND);
        
        // Verify ownership
        if (comment.author.toString() !== userId.toString()) {
            throw new AuthorizationError(ERROR_MESSAGES.NOT_AUTHORIZED);
        }
        
        // Don't allow editing deleted comments
        if (comment.isDeleted) {
            throw new AuthorizationError('Cannot edit a deleted comment');
        }
        
        comment.content = content;
        await comment.save();
        
        return Comment.findById(commentId)
            .populate('author', 'username')
            .lean();
    },
    
    async deleteComment(commentId, userId) {
        const comment = await Comment.findById(commentId);
        if (!comment) throw new NotFoundError(ERROR_MESSAGES.COMMENT_NOT_FOUND);
        
        // Verify ownership
        if (comment.author.toString() !== userId.toString()) {
            throw new AuthorizationError(ERROR_MESSAGES.NOT_AUTHORIZED);
        }
        
        // Check if the comment has replies
        const hasReplies = await Comment.hasReplies(commentId);
        
        if (hasReplies) {
            // Soft delete - mark as deleted but keep in the hierarchy
            comment.isDeleted = true;
            await comment.save();
            return { deleted: true, permanent: false };
        } else {
            // Hard delete - remove completely
            await Comment.findByIdAndDelete(commentId);
            return { deleted: true, permanent: true };
        }
    },
    
    async getReplies(commentId, query = {}) {
        const parentComment = await Comment.findById(commentId);
        if (!parentComment) throw new NotFoundError(ERROR_MESSAGES.COMMENT_NOT_FOUND);
        
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 20;
        const skip = (page - 1) * limit;
        
        const [replies, total] = await Promise.all([
            Comment.find({ parentId: commentId })
                .sort({ createdAt: 1 })
                .skip(skip)
                .limit(limit)
                .populate('author', 'username')
                .lean(),
            Comment.countDocuments({ parentId: commentId })
        ]);
        
        return {
            data: replies,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
};

module.exports = CommentService;