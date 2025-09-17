// Middleware for handling EPUB file uploads
const multer = require('multer');
const { ValidationError } = require('../utils/errors');
const { UPLOAD_LIMITS, NOVEL_ERRORS } = require('../utils/constants');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Check if the file is an EPUB
    if (file.mimetype !== UPLOAD_LIMITS.EPUB_TYPE) {
        return cb(
            new ValidationError(NOVEL_ERRORS.EPUB_INVALID_FORMAT)
        );
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: UPLOAD_LIMITS.EPUB_SIZE // Use dedicated EPUB size limit
    },
    fileFilter: fileFilter
});

const uploadEpub = upload.single('epub');

// Error handling wrapper for multer
const handleEpubUpload = (req, res, next) => {
    uploadEpub(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(
                    new ValidationError(
                        `File size exceeds the limit of ${UPLOAD_LIMITS.CHAPTER_SIZE / (1024 * 1024)} MB`
                    )
                );
            }
            return next(new ValidationError(err.message));
        } else if (err) {
            return next(err);
        }
        next();
    });
};

module.exports = {
    handleEpubUpload
};