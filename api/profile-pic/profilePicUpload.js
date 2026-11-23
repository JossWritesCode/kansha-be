const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { s3, bucket } = require('../images/storage');

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

const upload = multer({
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
		return cb(new Error('Only PNG, JPEG, GIF or WebP images are allowed'));
	},
	storage: multerS3({
		s3: s3,
		// Resolved per request so the API still boots without storage configured.
		bucket: (req, file, cb) =>
			bucket
				? cb(null, bucket)
				: cb(new Error('Image storage is not configured (set BUCKET)')),
		contentType: multerS3.AUTO_CONTENT_TYPE,
		metadata: function(req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function(req, file, cb) {
			cb(
				null,
				Date.now().toString() + path.extname(file.originalname).toLowerCase(),
			);
		},
	}),
});

module.exports = upload;
