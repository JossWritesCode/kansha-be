const server = require('../../server');
const request = require('supertest');
const db = require('../../data/dbConfig');

module.exports = () =>
	describe('/employees router', () => {
		describe('POST /employees', () => {
			it('should return new employee ID', async () => {
				const { body } = await request(server)
					.post('/employees')
					.send({
						first_name: 'Test',
						last_name: 'User 5',
						email: 'testing_email2@kansharewards.com',
						department: 'X',
						job_title: 'Person',
						user_type: 'admin',
						org_name: 'Organization 3',
					});
				expect(body.user_id).toBe(6);
			});
		});

		describe('/GET employees for a particular organziation', () => {
			it('should return a list of employees per organization', async () => {
				const { body } = await request(server).get(
					'/employees/organizations',
				);
				expect(body).toEqual(
					expect.objectContaining({
						count: expect.any(Number),
						employees: expect.arrayContaining([
							{
								department: expect.any(String),
								first_name: expect.any(String),
								id: expect.any(Number),
								job_title: expect.any(String),
								last_name: expect.any(String),
								org_name: expect.any(String),
								profile_picture: expect.any(String),
								user_type: expect.any(String),
								team_count: expect.any(Number),
							},
						]),
					}),
				);
			});

			it("should count each employee's teams", async () => {
				const { body } = await request(server).get(
					'/employees/organizations',
				);
				const rows = await db('TeamMembers')
					.select('user_id')
					.count('* as teams')
					.groupBy('user_id');
				const teamsByUser = Object.fromEntries(
					rows.map(row => [row.user_id, Number(row.teams)]),
				);
				body.employees.forEach(emp =>
					expect(emp.team_count).toBe(teamsByUser[emp.id] || 0),
				);
				expect(body.employees.some(emp => emp.team_count > 0)).toBe(true);
			});
		});

		describe('GET /employees  ', () => {
			it('should return a list of employees', async () => {
				const { body } = await request(server).get('/employees');
				expect(body).toEqual(
					expect.arrayContaining([
						{
							department: expect.any(String),
							email: expect.any(String),
							first_name: expect.any(String),
							id: expect.any(Number),
							job_title: expect.any(String),
							last_name: expect.any(String),
							org_id: expect.any(Number),
							org_name: expect.any(String),
							profile_picture: expect.any(String),
							user_id: expect.any(Number),
							user_type: expect.any(String),
						},
					]),
				);
			});
		});

		describe('DELETE /employees/:id', () => {
			it('should successfully delete an employee by id', async () => {
				const { status } = await request(server).delete('/employees/5');
				expect(status).toBe(204);
			});
		});

		describe('GET /employees/:id', () => {
			it('should fetch one employee', async () => {
				const { body } = await request(server).get('/employees/3');
				expect(body).toMatchObject({
					id: expect.any(Number),
					user_id: expect.any(Number),
					first_name: expect.any(String),
					last_name: expect.any(String),
					email: expect.any(String),
					org_id: expect.any(Number),
					department: expect.any(String),
					profile_picture: expect.any(String),
					job_title: expect.any(String),
					user_type: expect.any(String),
					org_name: expect.any(String),
				});
			});
		});

		describe('PUT /employees:id', () => {
			it('should edit an employee by id', async () => {
				const { body } = await request(server)
					.put('/employees/3')
					.send({
						last_name: 'User 100',
						job_title: 'Will be deleted',
					});
				expect(body).toEqual(
					expect.arrayContaining([
						{
							id: expect.any(Number),
							first_name: expect.any(String),
							last_name: expect.any(String),
							profile_picture: expect.any(String),
							email: expect.any(String),
							job_title: expect.any(String),
							user_type: expect.any(String),
							org_id: expect.any(Number),
							org_name: expect.any(String),
							teams: [
								{
									member_id: expect.any(Number),
									name: expect.any(String),
									team_id: expect.any(Number),
									team_role: expect.any(String),
								},
							],
						},
					]),
				);
			});
		});
	});
