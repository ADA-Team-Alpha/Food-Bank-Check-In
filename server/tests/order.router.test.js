const app = require('../server');
const request = require('supertest');
// const pool = require('../modules/pool');

// beforeAll(async (done) => {
//   await pool.query(
//     "INSERT INTO location (id, description) VALUES (1234567, 'order test location');"
//   );
//   done();
// });

// afterAll(async (done) => {
//   await pool.query("DELETE FROM location WHERE id = 1234567;");
//   done();
// });

const testUser = request.agent(app);
const testUserID = 2;
const testUserName = 'test_order';
const testUserEmail = 'test_order@email.com';
const testUserPassword = 'test_order_password';

const locationID = 1234567;
const dietaryRestrictions = 'Dairy';
const walkingHome = false;
const pregnant = false;
const childBirthday = true;

describe('Normal client with access level 1 for /api/order', () => {
  describe('POST to login /api/account/login', () => {
    it("Post the user's info to start a new session", async (done) => {
      await testUser
        .post('/api/account/login')
        .send({
          username: testUserEmail,
          password: testUserPassword
        })
        .expect(200);
      done();
    });
  });

  describe('GET /api/account/', () => {
    it("Get the test order user's account info", async (done) => {
      const res = await testUser
        .get('/api/account')
        .expect(200);
      expect(res.body).toEqual({
        id: testUserID,
        name: testUserName,
        email: testUserEmail,
        access_level: 1
      });
      done();
    });
  });

  describe('POST to /api/order', () => {
    it('Responds with the order object', async (done) => {
      const res = await testUser
        .post('/api/order')
        .send({
          location_id: locationID,
          dietary_restrictions: dietaryRestrictions,
          walking_home: walkingHome,
          pregnant: pregnant,
          child_birthday: childBirthday
        })
        .expect(201);
      expect(res.body).toEqual({
        id: expect.any(Number),
        account_id: testUserID,
        checkin_at: expect.any(String),
        checkout_at: null,
        location_id: locationID,
        dietary_restrictions: dietaryRestrictions,
        walking_home: walkingHome,
        pregnant: pregnant,
        child_birthday: childBirthday
      });
      done();
    });
  });
});

// describe("GET to /api/order", () => {
//   it("Respond with json", async (done) => {
//     const res = await request
//       .get("/api/order")
//       .expect(200);

//     expect(res.body).toEqual(
//       expect.arrayContaining([expect.objectContaining({ id: orderID })])
//               checkin_at: expect.any(Date),
//       checkout_at: null,
//       location_id: locationID,
//       dietary_restrictions: dietaryRestrictions,
//       walking_home: true,
//       pregnant: true,
//       child_birthday: true,
//       household_id: "111",
//       last_pickup: null
//     );
//     done();
//   });
// });

// describe("GET to /api/order/active", () => {
//   it("Respond with json", async (done) => {
//     const res = await request
//       .get("/api/order/active")
//       .expect(200);

//     expect(res.body).toEqual(
//       expect.arrayContaining([expect.objectContaining({ id: orderID })])
//     );
//     done();
//   });
// });

// describe("PUT to /api/order/checkout/id", () => {
//   it("Respond with json", async (done) => {
//     const res = await request
//       .put(`/api/order/checkout/${orderID}`)
//       .expect(200);

//     expect(res.body).toEqual(
//       expect.arrayContaining([expect.objectContaining({ id: orderID })])
//     );
//     done();
//   });
// });

// describe("GET to /api/order/complete/today", () => {
//   it("Respond with json", async (done) => {
//     const res = await request
//       .get("/api/order/complete/today")
//       .expect(200);

//     expect(res.body).toEqual(
//       expect.arrayContaining([expect.objectContaining({ id: orderID })])
//     );
//     done();
//   });
// });

// describe("DELETE to /api/order/id", () => {
//   it("Respond with 204 No Content", async (done) => {
//     await request.delete(`/api/order/${orderID}`).expect(204);

//     done();
//   });
// });
