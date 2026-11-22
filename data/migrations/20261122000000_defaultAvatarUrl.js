const { assetUrl } = require('../assetUrl');

const OLD_DEFAULT =
	'https://kansha-bucket.s3-us-west-1.amazonaws.com/avatarblank.png';

// The original S3 bucket is gone. Point the default avatar (and anyone still
// using the old default) at the copy served by the frontend.
exports.up = async function(knex) {
	const newDefault = assetUrl('images/avatarblank.png');
	await knex.schema.alterTable('Users', tbl => {
		tbl.string('profile_picture', 500)
			.defaultTo(newDefault)
			.alter();
	});
	await knex('Users')
		.where({ profile_picture: OLD_DEFAULT })
		.update({ profile_picture: newDefault });
};

exports.down = async function(knex) {
	await knex.schema.alterTable('Users', tbl => {
		tbl.string('profile_picture', 500)
			.defaultTo(OLD_DEFAULT)
			.alter();
	});
};
