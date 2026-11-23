// Update with your config settings.
require('dotenv').config();

module.exports = {
	development: {
		client: 'pg',
		connection: process.env.DATABASE_URL,
		migrations: {
			directory: './data/migrations',
		},
		seeds: {
			directory: './data/seeds',
		},
		pool: {
			min: 2,
			max: 10,
		},
	},

	staging: {
		client: 'pg',
		connection: process.env.DATABASE_URL,
		migrations: {
			directory: './data/migrations',
		},
		seeds: {
			directory: './data/seeds',
		},
		pool: {
			min: 2,
			max: 10,
		},
	},

	production: {
		client: 'pg',
		// Railway's private-network DATABASE_URL needs no SSL. Set DB_SSL=true
		// when connecting through a public/proxied URL that requires it.
		connection: {
			connectionString: process.env.DATABASE_URL,
			ssl:
				process.env.DB_SSL === 'true'
					? { rejectUnauthorized: false }
					: false,
		},
		migrations: {
			directory: './data/migrations',
		},
		seeds: {
			directory: './data/seeds',
		},
		pool: {
			min: 2,
			max: 10,
		},
	},

	testing: {
		client: 'pg',
		connection: {
			host: process.env.TEST_DB_HOST,
			user: process.env.TEST_DB_USER,
			password: process.env.TEST_DB_PASS,
			database: process.env.TEST_DB_NAME || 'kansha_test',
			port: process.env.TEST_DB_PORT || 5432,
		},
		migrations: {
			directory: './data/migrations',
		},
		seeds: {
			directory: './tests/seeds',
		},
		pool: {
			min: 2,
			max: 75,
		},
	},
};
