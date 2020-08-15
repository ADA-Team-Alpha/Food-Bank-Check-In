const app = require('../server');
const request = require('supertest');
const pool = require('../modules/pool');

const newUser = request.agent(app);

const newUserName = 'test';
const newUserEmail = 'test@test.com';
const newUserHouseholdID = '1';
const newUserPassword = 'test';
let newUserId = 0;

const stdNewUserResp = {
  id: expect.any(Number),
  name: newUserName,
  email: newUserEmail,
  access_level: 1,
  household_id: newUserHouseholdID,
  latest_order: null,
  active: true
};

afterAll(async (done) => {
  // Normally we don't delete orders so set the test account's most recent order to null
  // since that's a foreign key so we can delete the order that was just added.
  await pool.query(`UPDATE profile SET account_id = null WHERE account_id = ${newUserId};`);
  // Delete the profiles that have a null account_id for clean up.
  await pool.query(`DELETE FROM "profile" WHERE account_id is null;`);
  // Normally we set accounts "active" status to false but delete this test account to save space.
  await pool.query(`DELETE FROM account WHERE id = ${newUserId};`);
  done();
});

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
  it('Reject account updating while logged out with a bad request', async (done) => {
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

describe('POST to login with bad info /api/account/login', () => {
  it("Responds with an error", async (done) => {
    await newUser
      .post('/api/account/login')
      .send({})
      .expect(400);
    done();
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
    expect(res.body).toEqual(stdNewUserResp);
    done();
  });
});

describe('GET /api/account/1', () => {
  it('Reject get info for specific user because current user is not an admin', async (done) => {
    await newUser
      .get('/api/account/1')
      .expect(403);
    done();
  });
});

describe('PUT /api/account/1', () => {
  it('Reject put info for specific user when sending bad info', async (done) => {
    await newUser
      .put('/api/account/1')
      .send({})
      .expect(403);
    done();
  });
});

describe('DELETE /api/account/1', () => {
  it('Reject delete for specific user because current user is not an admin', async (done) => {
    await adminUser
      .delete(`/api/account/${newUserId}`)
      .expect(403);
    done();
  });
});

const adminUser = request.agent(app);
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

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
      access_level: 100,
      household_id: null,
      latest_order: null,
      active: true
    });
    done();
  });
});

describe(`GET /api/account/${newUserId}`, () => {
  it('Get info for the newly added client', async (done) => {
    const res = await adminUser
      .get(`/api/account/${newUserId}`)
      .expect(200);
    expect(res.body).toEqual(stdNewUserResp);
    done();
  });
});

describe(`PUT /api/account/${newUserId}`, () => {
  it('Reject info for the newly added client because of a bad request', async (done) => {
    await adminUser
      .put(`/api/account/${newUserId}`)
      .send({})
      .expect(400);
    done();
  });
});

const updateUser = {
  id: expect.any(Number),
  name: newUserName,
  email: newUserEmail,
  access_level: 1,
  active: true
};

describe(`PUT /api/account/${newUserId}`, () => {
  it('Edit info for the newly added client', async (done) => {
    const res = await adminUser
      .put(`/api/account/${newUserId}`)
      .send(updateUser)
      .expect(200);
    expect(res.body).toEqual(updateUser);
    done();
  });
});

describe(`DELETE /api/account/${newUserId}`, () => {
  it('Set the status of active for the newly added client to false', async (done) => {
    await adminUser
      .delete(`/api/account/${newUserId}`)
      .expect(204);
    done();
  });
});

describe(`GET /api/account/${newUserId}`, () => {
  it('See if the account now has active set to false', async (done) => {
    const res = await adminUser
      .get(`/api/account/${newUserId}`)
      .expect(200);
    expect(res.body).toEqual({
      ...updateUser,
      active: false,
      household_id: newUserHouseholdID,
      id: newUserId,
      latest_order: null
    });
    done();
  });
});
