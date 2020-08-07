const app = require('../server');
const request = require('supertest');

const newUser = request.agent(app);

const newUserName = 'test';
const newUserEmail = 'test@test.com';
const newUserHouseholdID = '1';
const newUserPassword = 'test';
let newUserId = 0;

describe('Test a newly added account', () => {
  describe('GET /api/account', () => {
    it('Reject get info for current user while logged out', async (done) => {
      await newUser
        .get('/api/account')
        .expect(403);
      done();
    });
  });

  describe('GET /api/account/1', () => {
    it('Reject get info for specific user while logged out', async (done) => {
      await newUser
        .get('/api/account/1')
        .expect(403);
      done();
    });
  });

  describe('PUT /api/account/1', () => {
    it('Reject account updating while logged out', async (done) => {
      await newUser
        .put('/api/account/1')
        .expect(403);
      done();
    });
  });

  describe('DELETE /api/account/1', () => {
    it('Reject account deletion while logged out', async (done) => {
      await newUser
        .delete('/api/account/1')
        .expect(403);
      done();
    });
  });

  // Create an account and run tests.
  describe('POST /api/account', () => {
    it('POST to make a new account with bad info at /api/account', async (done) => {
      await newUser
        .post('/api/account')
        .send({})
        .expect(400);
      done();
    });
  });

  describe('POST /api/account', () => {
    it('POST to make a new account at /api/account', async (done) => {
      const res = await newUser
        .post('/api/account')
        .send({
          name: newUserName,
          email: newUserEmail,
          household_id: newUserHouseholdID,
          password: newUserPassword
        })
        .expect(200);
      expect(res.body).toEqual({
        id: expect.any(Number)
      });
      done();
      newUserId = res.body.id;
    });
  });

  describe('POST to login /api/account/login', () => {
    it("responds with the user's information", async (done) => {
      await newUser
        .post('/api/account/login')
        .send({
          username: newUserEmail,
          password: newUserPassword
        })
        .expect(200);
      done();
    });
  });

  describe('GET /api/account/', () => {
    it('Get the account owner info', async (done) => {
      const res = await newUser
        .get('/api/account')
        .expect(200);
      expect(res.body).toEqual({
        id: expect.any(Number),
        name: newUserName,
        email: newUserEmail,
        access_level: 1,
        household_id: newUserHouseholdID
      });
      done();
    });
  });

  describe('GET /api/account/1', () => {
    it('Reject get info for specific user because current user is not an admin', async (done) => {
      await newUser
        .get('/api/account/1')
        .expect(401);
      done();
    });
  });
});

const adminUser = request.agent(app);

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

describe('Test an admin account', () => {
  describe('POST to login /api/account/login', () => {
    it("responds with the administrator's information", async (done) => {
      await adminUser
        .post('/api/account/login')
        .send({
          username: adminEmail,
          password: adminPassword
        })
        .expect(200);
      done();
    });
  });

  describe('GET /api/account/', () => {
    it('Get the account owner info', async (done) => {
      const res = await adminUser
        .get('/api/account')
        .expect(200);
      expect(res.body).toEqual({
        id: 1,
        name: expect.any(String),
        email: adminEmail,
        access_level: 100
      });
      done();
    });
  });

  describe(`GET /api/account/${newUserId}`, () => {
    it('Get info for the newly added client', async (done) => {
      const res = await adminUser
        .get(`/api/account/${newUserId}`)
        .expect(200);
      expect(res.body).toEqual({
        id: newUserId,
        name: newUserName,
        email: newUserEmail,
        access_level: 1
      });
      done();
    });
  });

  describe(`DELETE /api/account/${newUserId}`, () => {
    it('This is the last test so delete the newly added client', async (done) => {
      await adminUser
        .delete(`/api/account/${newUserId}`)
        .expect(204);
      done();
    });
  });
});
