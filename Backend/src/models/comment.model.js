const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    novelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Novel',
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
        index: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            if (ret.isDeleted) {
                ret.content = 'This comment was removed by user';
                ret.author = null;
            }
            return ret;
        }
    },
    toObject: {
        virtuals: true
    }
});

// Virtual field for child comments
commentSchema.virtual('replies', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parentId'
});

// Indexes for efficient querying
commentSchema.index({ novelId: 1, createdAt: -1 });
commentSchema.index({ parentId: 1, createdAt: 1 });

// Static methods for working with comments
commentSchema.statics = {
    // Get comments with pagination and optional filters
    async getNovelComments(novelId, { page = 1, limit = 20, parentId = null }) {
        const skip = (page - 1) * limit;
        
        // Find top-level comments (those without a parent) for the given novel
        const query = { 
            novelId, 
            parentId: parentId 
        };
        
        const [comments, total] = await Promise.all([
            this.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author', 'username')
                .populate({
                    path: 'replies',
                    options: { sort: { createdAt: 1 } },
                    populate: {
                        path: 'author',
                        select: 'username'
                    }
                })
                .lean(),
            this.countDocuments(query)
        ]);
        
        return {
            data: comments,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        };
    },
    
    // Check if a comment has replies
    async hasReplies(commentId) {
        const count = await this.countDocuments({ parentId: commentId });
        return count > 0;
    }
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;