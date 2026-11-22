const { badgeRows } = require('../badges');

// Fresh deployments need the built-in badges, so insert them if the table is
// empty. Keeps the id sequence in step with the explicit ids.
exports.up = async function(knex) {
	const [{ count }] = await knex('Badges').count('id as count');
	if (Number(count) > 0) return;
	await knex('Badges').insert(badgeRows());
	await knex.raw(
		`SELECT setval(pg_get_serial_sequence('"Badges"', 'id'), (SELECT MAX(id) FROM "Badges"))`,
	);
};

exports.down = function() {
	// Badges may be referenced by recognitions; leave them in place.
};
