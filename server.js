const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const server = express();
const userRouter = require('./api/user/userRouter');
const recRouter = require('./api/recognition/recRouter');
const badgeRouter = require('./api/recognition/badgeRouter');
const auth = require('./middleware/authMiddleWare');
const profileRouter = require('./api/profile/profileRouter');
const picRouter = require('./api/profile-pic/picRouter');
const liveFeedRouter = require('./api/livefeed/liveFeedRouter');
const reactionRouter = require('./api/reactions/reactionRouter');
const commentRouter = require('./api/reactions/commentRouter');
const organizationRouter = require('./api/organization/organizationRouter');
const employeeRouter = require('./api/employee/employeeRouter');
const csvUploadRouter = require('./api/csv/csvUploadRouter');
const reportRouter = require('./api/reports/reportRouter');
const teamRouter = require('./api/teams/teamRouter');
const imageRouter = require('./api/images/imageRouter');

// Global MiddleWare
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(helmet());
// FRONTEND_URL may be a comma-separated list (e.g. production + localhost).
const allowedOrigins = (process.env.FRONTEND_URL || '')
	.split(',')
	.map(o => o.trim().replace(/\/$/, ''))
	.filter(Boolean);
server.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined));
server.use('/badges', badgeRouter);
server.use('/images', imageRouter);

server.get('/', (req, res) => {
	res.status(200).json({ message: 'API is Running!' });
});

server.use(auth.validateToken);

server.use('/teams', teamRouter);
server.use('/reports', reportRouter);
server.use('/users', userRouter);
server.use('/csv', csvUploadRouter);
server.use('/employees', employeeRouter);
server.use('/organizations', organizationRouter);
server.use('/profile', profileRouter);
server.use('/profile-pic', picRouter);
server.use('/feed', liveFeedRouter);
server.use('/rec', auth.validateId, recRouter);
server.use('/comments', auth.validateId, commentRouter);
server.use('/reactions', auth.validateId, reactionRouter);

module.exports = server;
