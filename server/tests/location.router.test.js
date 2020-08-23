const app = require('../server');
const request = require('supertest');
const users = require('./testUsers');

const adminUser = request.agent(app);
const adminInfo = users.adminUser;
const adminEmail = adminInfo.adminEmail;
const adminPassword = adminInfo.adminPassword;

const locationID = 1234567;
const locationDescription = 'order test location';
const newLocationDescription = 'New description.';
const locationObject = {
  id: locationID,
  description: locationDescription
};
const newLocationObject = {
  id: locationID,
  description: newLocationDescription
};

// const testUser = request.agent(app);
// const testUserInfo = users.testUser;
// const testUserID = testUserInfo.testUserID;
// const testUserName = testUserInfo.testUserName;
// const testUserEmail = testUserInfo.testUserEmail;
// const testUserPassword = testUserInfo.testUserPassword;

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
  it("Get the admin's info", async (done) => {
    const res = await adminUser
      .get('/api/account')
      .expect(200);
    expect(res.body).toEqual({
      id: 1,
      name: adminInfo.name,
      email: adminInfo.adminEmail,
      access_level: adminInfo.accessLevel,
      household_id: adminInfo.householdID,
      latest_order: adminInfo.latestOrder,
      active: adminInfo.active,
      approved: adminInfo.approved
    });
    done();
  });
});

describe('GET /api/location/', () => {
  it('Responds with an array of locations.', async (done) => {
    const res = await adminUser
      .get('/api/location')
      .expect(200);
    expect(res.body).toEqual(
      expect.arrayContaining([expect.any(Object)])
    );
    done();
  });
});

// Start with posting a new location
describe('POST /api/location', () => {
  it('Posts the new location', async (done) => {
    const res = await adminUser
      .post('/api/location')
      .send(locationObject)
      .expect(201);
    expect(res.body).toEqual(locationObject);
    done();
  });
});

describe(`PUT /api/location/${locationID}`, () => {
  it('Responds with the updated array.', async (done) => {
    const res = await adminUser
      .put(`/api/location/${locationID}`)
      .send(newLocationObject)
      .expect(200);
    expect(res.body).toEqual(newLocationObject);
    done();
  });
});

describe('GET /api/location/', () => {
  it('Responds with an array of locations.', async (done) => {
    const res = await adminUser
      .get('/api/location')
      .expect(200);
    expect(res.body).toEqual(
      expect.arrayContaining([newLocationObject])
    );
    done();
  });
});

describe(`DELETE /api/location/${locationID}`, () => {
  it('Responds with status code 204 OK because a location was deleted.', async (done) => {
    await adminUser
      .delete(`/api/location/${locationID}`)
      .expect(204);
    done();
  });
});

describe('GET /api/location/', () => {
  it('Responds with an array of locations.', async (done) => {
    const res = await adminUser
      .get('/api/location')
      .expect(200);
    expect(res.body).not.toEqual(
      expect.arrayContaining([newLocationObject])
    );
    done();
  });
});
