const router = require('express').Router();
const expressJwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const { editUser, find } = require('../api/user/userModel.js');

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const tokenValidator = expressJwt({
	// Dynamically provide a signing key
	// based on the id in the header and
	// the signing keys provided by the JWKS endpoint.
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: process.env.SIGNING_CERT_URL,
		// jwks-rsa's default turns "key not found" into an empty secret, which
		// express-jwt 5 mishandles (it surfaces as a non-auth error, i.e. 503).
		// Pass the error through so the handler below can answer 401.
		handleSigningKeyError: (err, cb) => cb(err),
	}),

	// Validate the audience and the issuer.
	audience: process.env.CLIENT_ID,
	issuer: process.env.DOMAIN,
	algorithms: ['RS256'],
});

const fixSSEToken = (req, res, next) => {
	req.headers.authorization = req.headers.authorization || req.query.token;
	next();
};

module.exports.validateId = async (req, res, next) => {
	if (!req.user) {
		// validateToken should always set req.user; never continue without it
		return res.status(401).json({ message: 'Not authenticated' });
	}
	try {
		const { sub, email, name } = req.user;
		// check if there is a user based on sub
		let [user] = await find({ 'Users.sub': sub });
		const search = email || name;
		if (!user) {
			// check if there is a user based on email
			[user] = await find({ email: search });
			if (!user) {
				// returns 200 so that onboarding can be accounted for.
				return res.status(200).json({ user: false });
			} else {
				// adds sub if user is found by email
				await editUser(user.id, { sub });
				req.profile = user;
				return next();
			}
		} else {
			if (!user.email) {
				// adds email address for legacy users
				await editUser(user.id, { email: search });
			}
			req.profile = user;
			return next();
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error validating user' });
	}
};

router.use(fixSSEToken);
router.use(tokenValidator);

router.use((err, req, res, next) => {
	if (err.name === 'UnauthorizedError') {
		return res.status(401).json({ message: err.message });
	}
	if (err.name === 'SigningKeyNotFoundError') {
		// The token was signed by a key SIGNING_CERT_URL doesn't publish:
		// usually a different Auth0 tenant than the frontend logs in with.
		console.error(`${err.message} (check SIGNING_CERT_URL)`);
		return res
			.status(401)
			.json({ message: 'Token was signed by an unknown key' });
	}
	// Anything else (e.g. the JWKS signing keys couldn't be fetched or the
	// fetch was rate limited) means the token could not be verified. Never
	// let the request continue unauthenticated.
	console.error(err);
	return res
		.status(503)
		.json({ message: 'Unable to verify credentials, please try again' });
});

module.exports.validateToken = router;
