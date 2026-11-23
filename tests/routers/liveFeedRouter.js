const server = require('../../server');
const request = require('supertest');

module.exports = () => {
	describe('/livefeed router', () => {
		describe('GET /feed', () => {
			it('should display all items in feed', async () => {
				const { body } = await request(server).get('/feed');
				expect(body).toEqual(
					expect.arrayContaining([
						{
							id: expect.any(Number),
							sub: expect.any(String),
							first_name: expect.any(String),
							last_name: expect.any(String),
							department: expect.any(String),
							profile_picture: expect.stringMatching(/avatarblank\.png$/),
							email: expect.any(String),
							recipient: expect.any(Number),
							sender: expect.any(Number),
							message: expect.any(String),
							date: expect.stringContaining('2020-03-01'),
							badge_id: null,
							org_id: expect.any(Number),
							org_name: expect.any(String),
							recipient_last: expect.any(String),
							recipient_first: expect.any(String),
							recipient_job_title: expect.any(String),
							recipient_picture: expect.stringMatching(/avatarblank\.png$/),
						},
					]),
				);
			});
		});
	});
};
