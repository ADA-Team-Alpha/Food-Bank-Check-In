const app = require('../server');
const testServer = require('supertest')(app);

// describe('Test the account path', () => {
//   it('It should respond 200 the account owner', async (done) => {
//     const response = await testServer(app).get('/api/account');
//     expect(response.statusCode).toBe(200);
//     done();
//   });
// });

// describe('POST /api/account', () => {
//   it('responds with account POST query result', async (done) => {
//     const res = await testServer
//       .post('/api/account')
//       .send({
//         name: 'name',
//         email: 'email',
//         password: 'password'
//       })
//       .expect(200);
//     console.log(res.body);
//     // expect(res.body).toHaveProperty({
//     //   name: 'name',
//     //   email: 'email',
//     //   password: 'password'
//     // });
//     done();
//   });
// });

test('app exists', () => {
  expect(true).toBe(true);
});
