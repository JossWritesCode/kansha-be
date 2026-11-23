const server = require('../../server');
const request = require('supertest');

module.exports = () => {
	describe('/comments router', () => {
		describe('/GET /comments/:rec_id', () => {
			it('return a comment on a recognition', async () => {
				const { body } = await request(server).get('/comments/1');
				expect(body).toEqual(
					expect.arrayContaining([
						{
							first_name: 'Test',
							last_name: 'User 1',
							id: 1,
							user_id: 1,
							rec_id: 1,
							message: 'this is a message',
							date: '2020-03-01T00:00:00.000Z',
							profile_picture: expect.stringMatching(/avatarblank\.png$/),
						},
					]),
				);
			});
		});
		describe('/POST /comments', () => {
			it('successfully posts a new comment', async () => {
				const { status } = await request(server)
					.post('/comments')
					.send({
						rec_id: 1,
						message: 'this is another message',
						date: '2020-03-01T00:00:00.000Z',
					});
				expect(status).toBe(201);
			});
		});

		describe('/DELETE /id', () => {
			it('deletes a comment', async () => {
				const { status } = await request(server).delete('/comments/5');
				expect(status).toBe(204);
			});
		});
	});
};
