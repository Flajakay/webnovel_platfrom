const Novel = require('../models/novel.model');
const User = require('../models/user.model'); 
const elasticsearchService = require('./elasticsearch.service');
const RecommendationService = require('./recommendation/recommendation.service');
const {
	NotFoundError,
	ValidationError
} = require('../utils/errors');
const {
	ERROR_MESSAGES,
	UPLOAD_LIMITS
} = require('../utils/constants');
const logger = require('../utils/logger');

const prepareNovelForElasticsearch = (novel) => {
	const esNovel = novel.toObject ? novel.toObject() : { ...novel };
	
	if (esNovel.cover) {
		delete esNovel.cover;
	}
	
	return esNovel;
};

const NovelService = {
	async createNovel(novelData, authorId, coverFile) {
		const novelObj = {
			...novelData,
			author: authorId
		};

		if (coverFile) {
			novelObj.cover = {
				data: coverFile.buffer,
				contentType: coverFile.mimetype
			};
		}

		const novel = await Novel.create(novelObj);

		const populatedNovel = await Novel.findById(novel._id)
			.populate('author', 'username')
			.lean();

		const esNovel = prepareNovelForElasticsearch(populatedNovel);

		await elasticsearchService.indexNovel(esNovel);
		return novel.toJSON();
	},

	async getNovels(query = {}) {
		try {
			// If no search parameters are provided, use MongoDB
			if (!query.search && !query.genres && !query.tags && 
				!query.status && !query.minRating && !query.author) {
				return this._getNovelsByMongoDB(query);
			}

			const searchResults = await elasticsearchService.searchNovels(query);

			// If no results from Elasticsearch, fallback to MongoDB
			if (!searchResults.hits.length) {
				return this._getNovelsByMongoDB(query);
			}

			const novels = await Novel.find({
					_id: {
						$in: searchResults.hits.map(hit => hit.id)
					}
				})
				.populate('author', 'username')
				.lean();

			// Maintain Elasticsearch ordering and add hasCover property
			const sortedNovels = searchResults.hits
				.map(hit => {
					const novel = novels.find(n => n._id.toString() === hit.id);
					if (novel) {
						// Add the hasCover property
						novel.hasCover = !!(novel.cover && novel.cover.data);
					}
					return novel;
				})
				.filter(Boolean);

			return {
				data: sortedNovels,
				pagination: {
					page: parseInt(query.page) || 1,
					limit: parseInt(query.limit) || 10,
					total: searchResults.total,
					pages: Math.ceil(searchResults.total / (parseInt(query.limit) || 10))
				}
			};
		} catch (error) {
			logger.error('Elasticsearch search failed, falling back to MongoDB:', error);
			return this._getNovelsByMongoDB(query);
		}
	},

	async _getNovelsByMongoDB({
		page = 1,
		limit = 10,
		sortBy,
		order = 'desc',
		...filters
	}) {
		const query = {};
		const sort = {};

		if (filters.status) query.status = filters.status;
		if (filters.genres) {
			query.genres = {
				$in: Array.isArray(filters.genres) ? filters.genres : [filters.genres]
			};
		}
		if (filters.tags) {
			query.tags = {
				$in: Array.isArray(filters.tags) ? filters.tags : [filters.tags]
			};
		}
		if (filters.minRating) {
			query['calculatedStats.averageRating'] = {
				$gte: Number(filters.minRating)
			};
		}
		if (filters.search) {
			query.$or = [{
					title: new RegExp(filters.search, 'i')
				},
				{
					description: new RegExp(filters.search, 'i')
				}
			];
		}

		// Determine sort order: 1 for ascending, -1 for descending
		const sortOrder = order === 'asc' ? 1 : -1;

		switch (sortBy) {
			case 'rating':
				sort['calculatedStats.averageRating'] = sortOrder;
				break;
			case 'views':
				sort.viewCount = sortOrder;
				break;
			case 'recent':
				sort.createdAt = sortOrder;
				break;
			case 'chapters':
				sort.totalChapters = sortOrder;
				break;
			default:
				sort.createdAt = sortOrder;
		}

		const [novels, total] = await Promise.all([
			Novel.find(query)
			.sort(sort)
			.skip((page - 1) * limit)
			.limit(limit)
			.populate('author', 'username')
			.lean(),
			Novel.countDocuments(query)
		]);

		return {
			data: novels,
			pagination: {
				page: parseInt(page),
				limit: parseInt(limit),
				total,
				pages: Math.ceil(total / limit)
			}
		};
	},

	async getNovelById(id, includeChapters = false) {
		const query = Novel.findById(id).populate('author', 'username');

		if (includeChapters) {
			query.populate({
				path: 'chapters',
				select: 'chapterNumber title status readCount contentPreview',
				options: {
					sort: {
						chapterNumber: 1
					}
				}
			});
		}

		const novel = await query.exec();
		if (!novel) throw new NotFoundError(ERROR_MESSAGES.NOVEL_NOT_FOUND);
		return novel;
	},

	async getNovelCover(id) {
		const novel = await Novel.findById(id).select('cover');
		if (!novel) throw new NotFoundError(ERROR_MESSAGES.NOVEL_NOT_FOUND);
		if (!novel.cover || !novel.cover.data) {
			throw new NotFoundError('Novel cover not found');
		}
		return novel.cover;
	},

	async updateNovel(id, updateData, coverFile) {
		const updateObj = { ...updateData };
		
		if (coverFile) {
			updateObj.cover = {
				data: coverFile.buffer,
				contentType: coverFile.mimetype
			};
		}
		
		const novel = await Novel.findByIdAndUpdate(
			id,
			updateObj, {
				new: true,
				runValidators: true
			}
		).populate('author', 'username');

		if (!novel) throw new NotFoundError(ERROR_MESSAGES.NOVEL_NOT_FOUND);
		
		const esNovel = prepareNovelForElasticsearch(novel);
		
		await elasticsearchService.updateNovel(id, esNovel);
		return novel;
	},

	async deleteNovel(id) {
		const novel = await Novel.findByIdAndDelete(id);
		if (!novel) throw new NotFoundError(ERROR_MESSAGES.NOVEL_NOT_FOUND);
		await elasticsearchService.deleteNovel(id);
		return true;
	},

	async addRating(novelId, userId, rating) {
		if (rating < 1 || rating > 5) {
			throw new ValidationError('Rating must be between 1 and 5');
		}

		const novel = await Novel.findById(novelId);
		if (!novel) throw new NotFoundError(ERROR_MESSAGES.NOVEL_NOT_FOUND);

		await novel.addRating(userId, rating);
		
		const esNovel = prepareNovelForElasticsearch(novel);
		
		await elasticsearchService.updateNovel(novelId, esNovel);

		// Invalidate user's recommendation cache after rating a novel
		RecommendationService.invalidateUserRecommendations(userId);

		return {
			id: novel._id,
			averageRating: novel.calculatedStats.averageRating,
			ratingCount: novel.calculatedStats.ratingCount
		};
	},

	async getRatingStats(novelId) {
		const novel = await Novel.findById(novelId);
		if (!novel) throw new NotFoundError(ERROR_MESSAGES.NOVEL_NOT_FOUND);
		return Novel.getRatingStats(novelId);
	},

	async getUserRating(novelId, userId) {
		const novel = await Novel.findById(novelId);
		if (!novel) throw new NotFoundError(ERROR_MESSAGES.NOVEL_NOT_FOUND);
		return novel.getUserRating(userId);
	},

	async removeRating(novelId, userId) {
		const novel = await Novel.findById(novelId);
		if (!novel) throw new NotFoundError(ERROR_MESSAGES.NOVEL_NOT_FOUND);

		await novel.removeRating(userId);
		
		const esNovel = prepareNovelForElasticsearch(novel);
		
		await elasticsearchService.updateNovel(novelId, esNovel);

		// Invalidate user's recommendation cache after removing a rating
		RecommendationService.invalidateUserRecommendations(userId);

		return {
			id: novel._id,
			averageRating: novel.calculatedStats.averageRating,
			ratingCount: novel.calculatedStats.ratingCount
		};
	},

	async incrementViewCount(novelId) {
		const novel = await Novel.findByIdAndUpdate(
			novelId, {
				$inc: {
					viewCount: 1
				}
			}, {
				new: true
			}
		);

		if (!novel) throw new NotFoundError(ERROR_MESSAGES.NOVEL_NOT_FOUND);
		
		const esNovel = prepareNovelForElasticsearch(novel);
		
		await elasticsearchService.updateNovel(novelId, esNovel);
		return {
			viewCount: novel.viewCount
		};
	},
	
	async getNovelsByAuthorId(authorId, query = {}) {
		const page = parseInt(query.page) || 1;
		const limit = parseInt(query.limit) || 20;
		const skip = (page - 1) * limit;

		const filter = { author: authorId };
		
		if (query.status) {
			filter.status = query.status;
		}

		const [novels, totalCount] = await Promise.all([
			Novel.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.populate('author', 'username')
				.lean(),
			Novel.countDocuments(filter)
		]);

		return {
			data: novels,
			pagination: {
				page,
				limit,
				total: totalCount,
				pages: Math.ceil(totalCount / limit)
			}
		};
	},
	
	async getMyNovels(userId, query = {}) {
		console.log('Received userId:', userId, 'Type:', typeof userId);
		const page = parseInt(query.page) || 1;
		const limit = parseInt(query.limit) || 20;
		const skip = (page - 1) * limit;

		const [novels, totalCount] = await Promise.all([
			Novel.find({ author: userId })
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			Novel.countDocuments({ author: userId })
		]);

		return {
			data: novels,
			pagination: {
				page,
				limit,
				total: totalCount,
				pages: Math.ceil(totalCount / limit)
			}
		};
	},

	async getAuthorAnalytics(authorId) {
		const user = await User.findById(authorId);
		if (!user) {
			throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND);
		}
	        
        const aggregateStats = await Novel.getAggregateAuthorStats(authorId);
        
		return {
			aggregateStats,
		};
    },

	async removeCover(novelId) {
		const novel = await Novel.findByIdAndUpdate(
			novelId,
			{ $unset: { cover: 1 } },
			{ new: true }
		);

		if (!novel) throw new NotFoundError(ERROR_MESSAGES.NOVEL_NOT_FOUND);
		return novel;
	}
};

module.exports = NovelService;