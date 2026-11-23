const router = require('express').Router();
const { getUserInteractions } = require('./profileModel');
const auth = require('../../middleware/authMiddleWare');
const { find } = require('../user/userModel.js');

router.use(auth.validateId);

router.get('/', async (req, res) => {
	try {
		const rec = await getUserInteractions(req.profile.id);
		let { profile } = req;
		profile.rec = rec;
		res.status(200).json({ user: profile });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error fetching profile' });
	}
});

router.get('/:id', validatePeerId, async (req, res) => {
	try {
		const rec = await getUserInteractions(req.peer.id);
		let { peer } = req;
		peer.rec = rec;
		res.status(200).json({ peer });
	} catch (err) {
		console.error(err);
		res.status(500).json({ err });
	}
});

async function validatePeerId(req, res, next) {
	const { id } = req.params;
	const { profile } = req;
	try {
		const [user] = await find({ 'Users.id': id });
		if (!user || user.org_name !== profile.org_name) {
			res.status(200).json({ peer: false });
		} else {
			req.peer = user;
			next();
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error fetching peer' });
	}
}

module.exports = router;
