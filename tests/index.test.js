const employeeRouter = require('./routers/employeesRouter.js');
const organizationRouter = require('./routers/organizationRouter.js');
const usersRouter = require('./routers/usersRouter.js');
const recRouter = require('./routers/recRouter.js');
const profileRouter = require('./routers/profileRouter.js');
const picRouter = require('./routers/picRouter.js');
const reportRouter = require('./routers/reportRouter.js');
const csvUploadRouter = require('./routers/csvUploadRouter.js');
const reactionRouter = require('./routers/reactionRouter.js');
const commentRouter = require('./routers/commentRouter');

jest.mock('express-jwt', () => {
	return jest.fn(() => {
		return jest.fn((req, res, next) => {
			req.user = {
				sub: '1',
				email: 'testing_email@kansharewards.com',
			};
			next();
		});
	});
});

afterEach(() => {
	jest.clearAllMocks();
});

describe('router tests', () => {
	usersRouter();
	employeeRouter();
	organizationRouter();
	recRouter();
	profileRouter();
	picRouter();
	reportRouter();
	csvUploadRouter();
	reactionRouter();
	commentRouter();
});
