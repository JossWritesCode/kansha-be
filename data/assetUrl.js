require('dotenv').config();

// Static images (default avatar, badge art) are served by the frontend from
// kansha-fe/public. ASSET_BASE_URL overrides; otherwise the first FRONTEND_URL.
const assetBaseUrl = () =>
	(
		process.env.ASSET_BASE_URL ||
		(process.env.FRONTEND_URL || '').split(',')[0] ||
		'http://localhost:3000'
	)
		.trim()
		.replace(/\/$/, '');

const assetUrl = path => `${assetBaseUrl()}/${path.replace(/^\//, '')}`;

module.exports = { assetUrl };
