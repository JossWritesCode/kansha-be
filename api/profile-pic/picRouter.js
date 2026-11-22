const router = require('express').Router();

const upload = require('./profilePicUpload');
const { publicUrl } = require('../images/storage');
const userModel = require('../user/userModel.js');
const singleUpload = upload.single('image');

router.post('/', (req, res) => {
	singleUpload(req, res, async err => {
		if (err) {
			console.error(err);
			return res.status(400).json({ message: err.message });
		}
		if (!req.file) {
			return res.status(400).json({ message: 'No image was uploaded' });
		}
		const url = publicUrl(req.file.key);
		try {
			await userModel.editUserBySub(req.user.sub, { profile_picture: url });
			return res.json({ url });
		} catch (dbErr) {
			console.error(dbErr);
			return res.status(500).json({ message: 'Could not save profile picture' });
		}
	});
});

module.exports = router;
