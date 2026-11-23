require('dotenv').config();

// Static images (default avatar, badge art) are served by the frontend from
// kansha-fe/public. By default we store root-relative paths like
// "/badges/mvp.svg", which the browser resolves against whichever frontend is
// showing the page (Railway, localhost, a preview deploy...). Set
// ASSET_BASE_URL only if the images are hosted somewhere else, e.g. a CDN.
const assetUrl = path => {
	const cleanPath = `/${path.replace(/^\//, '')}`;
	const base = (process.env.ASSET_BASE_URL || '').trim().replace(/\/$/, '');
	return `${base}${cleanPath}`;
};

module.exports = { assetUrl };
