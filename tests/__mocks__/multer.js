const multer = require('multer');

module.exports = (() => {
	function multerMock() {
		return {
			single: jest.fn(() => {
				return jest.fn(async (req, res, next) => {
					const chunks = [];
					for await (const chunk of req) {
						chunks.push(chunk);
					}
					if (req.baseUrl === '/profile-pic') {
						req.file = {
							location: 'http://fake.url',
							key: 'fake.png',
						};
					} else {
						const parsed = Buffer.concat(chunks)
							.toString()
							.split('\r\n')
							.slice(4, 11)
							.join('\r\n');

						req.file = {
							buffer: Buffer.from(parsed),
						};
					}
					next();
				});
			}),
		};
	}
	multerMock.memoryStorage = multer.memoryStorage;
	multerMock.diskStorage = multer.diskStorage;
	multerMock.MulterError = multer.MulterError;
	return multerMock;
})();
