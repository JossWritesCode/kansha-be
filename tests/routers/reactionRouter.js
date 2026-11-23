const server = require('../../server');
const request = require('supertest');

module.exports = () => {
	describe('/reaction router', () => {
		describe('GET /reactions/:rec_id', () => {
			it('should return one reaction by id', async () => {
				const { body } = await request(server).get('/reactions/1');
				expect(body).toEqual(
					expect.arrayContaining([
						{
							first_name: 'Test',
							last_name: 'User 1',
							user_id: 1,
							id: 1,
							profile_picture: expect.stringMatching(/avatarblank\.png$/),
						},
					]),
				);
			});
		});
		describe('POST /reactions/', () => {
			it('should successfully add a reaction to a recognition', async () => {
				const { body } = await request(server)
					.post('/reactions')
					.send({
						rec_id: 1,
						user_id: 1,
						date: '2020-03-01T00:00:00.000Z',
					});
				expect(body.id).toBe(4);
			});
		});

		describe('DELETE /reactions/:id', () => {
			it('should successfully delete a reaction on a recognition', async () => {
				const { status } = await request(server).delete('/reactions/4');
				expect(status).toBe(204);
			});
		});
	});
};
