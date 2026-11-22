const router = require('express').Router();
const { s3, bucket } = require('./storage');

// Railway Buckets are private, so images are served by redirecting to a
// short-lived presigned URL. Bucket egress is free; the redirect itself is tiny.
const URL_TTL_SECONDS = 60 * 60;

router.get('/:key', (req, res) => {
	const { key } = req.params;
	if (!/^[\w.-]+$/.test(key)) {
		return res.status(400).json({ message: 'Invalid image key' });
	}
	try {
		const url = s3.getSignedUrl('getObject', {
			Bucket: bucket,
			Key: key,
			Expires: URL_TTL_SECONDS,
		});
		// Let browsers cache the redirect for a bit less than the signature lifetime.
		res.set('Cache-Control', `public, max-age=${URL_TTL_SECONDS - 300}`);
		return res.redirect(302, url);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Could not load image' });
	}
});

module.exports = router;
