const Library = require('../models/library.model');
const Novel = require('../models/novel.model');
const { NotFoundError, ConflictError } = require('../utils/errors');
const { NOVEL_ERRORS, LIBRARY_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');

// Import recommendation service to invalidate cache
const RecommendationService = require('./recommendation/recommendation.service');

const LibraryService = {
    async getUserLibrary(userId, query = {}) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 20;
        const skip = (page - 1) * limit;
        
        const filter = { user: userId };
        
        if (query.status) {
            filter.status = query.status;
        }
        
        const [items, totalCount] = await Promise.all([
            Library.find(filter)
                .populate({
                    path: 'novel',
                    select: 'title description author genres status totalChapters viewCount calculatedStats cover',
                    populate: {
                        path: 'author',
                        select: 'username'
                    }
                })
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit),
            Library.countDocuments(filter)
        ]);
        
        return {
            data: items,
            pagination: {
                page,
                limit,
                total: totalCount,
                pages: Math.ceil(totalCount / limit)
            }
        };
    },
    
    async addToLibrary(userId, novelId, status, notes) {
        const novel = await Novel.findById(novelId);
        if (!novel) {
            throw new NotFoundError(NOVEL_ERRORS.NOVEL_NOT_FOUND);
        }

        const existingItem = await Library.findOne({ user: userId, novel: novelId });
        if (existingItem) {
            throw new ConflictError(NOVEL_ERRORS.NOVEL_ALREADY_IN_LIBRARY);
        }
        
        // Create a new library item
        const libraryItem = await Library.create({
            user: userId,
            novel: novelId,
            status: status || LIBRARY_STATUS.WILL_READ,
            notes: notes || ''
        });
        
        // Invalidate user's recommendation cache
        RecommendationService.invalidateUserRecommendations(userId);
        
        return libraryItem;
    },
    
    async removeFromLibrary(userId, novelId) {
        const result = await Library.findOneAndDelete({ user: userId, novel: novelId });
        if (!result) {
            throw new NotFoundError(NOVEL_ERRORS.NOVEL_NOT_IN_LIBRARY);
        }
        
        // Invalidate user's recommendation cache
        RecommendationService.invalidateUserRecommendations(userId);
        
        return { success: true };
    },
    
    async updateLibraryItemStatus(userId, novelId, newStatus) {
        const libraryItem = await Library.findOne({ user: userId, novel: novelId });
        if (!libraryItem) {
            throw new NotFoundError(NOVEL_ERRORS.NOVEL_NOT_IN_LIBRARY);
        }
        
        libraryItem.status = newStatus;
        await libraryItem.save();
        
        // Invalidate user's recommendation cache when status changes
        RecommendationService.invalidateUserRecommendations(userId);
        
        return libraryItem;
    },
    
    async updateLastReadChapter(userId, novelId, chapterNumber) {
        const libraryItem = await Library.findOne({ user: userId, novel: novelId });
        
        if (!libraryItem) {
            throw new NotFoundError(NOVEL_ERRORS.NOVEL_NOT_IN_LIBRARY);
        }
        
        if (libraryItem.status !== LIBRARY_STATUS.CURRENTLY_READING) {
            libraryItem.status = LIBRARY_STATUS.CURRENTLY_READING;
        }
        
        libraryItem.lastReadChapter = chapterNumber;
        await libraryItem.save();
        
        // Reading progress changes can affect continue-reading recommendations
        RecommendationService.invalidateUserRecommendations(userId);
        
        return libraryItem;
    },

    async checkNovelInLibrary(userId, novelId) {
        const libraryItem = await Library.findOne({ user: userId, novel: novelId });
        if (!libraryItem) {
            return null;
        }
        return {
            status: libraryItem.status,
            lastReadChapter: libraryItem.lastReadChapter,
            notes: libraryItem.notes
        };
    }
};

module.exports = LibraryService;