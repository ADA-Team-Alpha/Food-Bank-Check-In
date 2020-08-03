const app = require('../server');
const testServer = require('supertest')(app);

describe('Test the account path', () => {
  it('It should respond with the account owner', async (done) => {
    const res = await testServer(app).get('/api/account');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      description: "test location"
    });
    done();
  });
});
