const aws = require('aws-sdk');

// S3-compatible storage. Works with Railway Buckets (default), AWS S3 or
// Cloudflare R2. Railway exposes BUCKET, REGION, ENDPOINT, ACCESS_KEY_ID and
// SECRET_ACCESS_KEY on the bucket resource; reference them from this service.
const s3 = new aws.S3({
	accessKeyId: process.env.ACCESS_KEY_ID,
	secretAccessKey: process.env.SECRET_ACCESS_KEY,
	region: process.env.REGION || 'auto',
	endpoint: process.env.ENDPOINT || undefined,
	// Older Railway buckets need path-style URLs; the bucket's Credentials tab says which.
	s3ForcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
	signatureVersion: 'v4',
});

const bucket = process.env.BUCKET;

// Public URL for an uploaded object, served through GET /images/:key on this API.
const publicUrl = key => {
	const base = (process.env.PUBLIC_API_URL || '').replace(/\/$/, '');
	return `${base}/images/${encodeURIComponent(key)}`;
};

module.exports = { s3, bucket, publicUrl };
