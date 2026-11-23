const { badgeRows } = require('../badges');

exports.seed = function(knex) {
	return knex('Badges').insert(badgeRows());
};
