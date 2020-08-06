const app = require('../server');
const request = require('supertest');

const adminUser = request.agent(app);
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

let newSpotID = 0;

describe('Test an admin account', () => {
  describe('POST to login /api/location', () => {
    it("responds with the administrator's information", async (done) => {
      const res = await adminUser
        .post('/api/location')
        .send({
          id: 1,
          password: adminPassword
        })
        .expect(200);
      done();
      newSpotID = res.body
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


// Start with posting a new location
describe("POST /api/location", () => {
  it("responds with json", async (done) => {
    const res = await request
      .post("/api/location")
      .send({
        id: 1234567,
        description: "test",
      })
      //.expect("Content-Type", /json/)
      .expect(201);
			expect(res.body).toEqual(expect.objectContaining({id: 1234567}));
    done();
  });
});

describe("PUT /api/location/:id", () => {
  it("responds with json", async (done) => {
    const res = await request
      .put("/api/location/1234567")
      .send({
        id: 1234567,
        description: "test edited",
      })
      //.expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual({
      id: 1234567,
      description: "test edited",
    });
    done();
  });
});

describe("GET /api/location/", () => {
  it("responds with json", async (done) => {
    const res = await request
      .get("/api/location")
      .set("Accept", "application/json")
      // .expect("Content-Type", /json/)
			.expect(200);

		expect(res.body).toEqual(
			expect.arrayContaining([expect.objectContaining({
			id: 1234567,
			description: "test edited",
		})])
		);
		
		done();
  });
});

describe("DELETE /api/location/id", () => {
	it("responds with status code 204 OK", async (done) => {
		const res = await request
		.delete("/api/location/1234567")
		.expect(204);
	done();
	})
})