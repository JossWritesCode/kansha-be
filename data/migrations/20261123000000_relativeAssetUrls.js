const { assetUrl } = require('../assetUrl');

// Earlier migrations baked FRONTEND_URL into badge and default-avatar URLs
// (e.g. "http://localhost:3000/badges/mvp.svg"), which broke whenever that
// variable was unset or changed. Rewrite them to whatever assetUrl() returns
// now: a root-relative path unless ASSET_BASE_URL is set.
//
// Only touches frontend-hosted assets. Uploaded profile pictures live at
// "<api>/images/<timestamp>.<ext>" and never match these patterns.
const BADGE = /^https?:\/\/[^/]+\/(badges\/[^/]+)$/;
const AVATAR = /^https?:\/\/[^/]+\/(images\/avatarblank\.png)$/;

exports.up = async function(knex) {
	const badges = await knex('Badges').select('id', 'badge_URL');
	for (const { id, badge_URL } of badges) {
		const match = BADGE.exec(badge_URL || '');
		if (match) {
			await knex('Badges')
				.where({ id })
				.update({ badge_URL: assetUrl(match[1]) });
		}
	}

	const avatar = assetUrl('images/avatarblank.png');
	const users = await knex('Users')
		.select('id', 'profile_picture')
		.where('profile_picture', 'like', '%/images/avatarblank.png');
	for (const { id, profile_picture } of users) {
		if (AVATAR.test(profile_picture)) {
			await knex('Users')
				.where({ id })
				.update({ profile_picture: avatar });
		}
	}

	await knex.schema.alterTable('Users', tbl => {
		tbl.string('profile_picture', 500)
			.defaultTo(avatar)
			.alter();
	});
};

exports.down = function() {
	// Absolute URLs were the bug; nothing to restore.
};
