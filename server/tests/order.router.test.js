const app = require("../server");
const request = require("supertest")(app);
const pool = require("../modules/pool");

beforeAll(async (done) => {
  await pool.query(
    "INSERT INTO location (id, description) VALUES (1234567, 'order test location');"
  );
  done();
});

afterAll(async (done) => {
  await pool.query("DELETE FROM location WHERE id = 1234567;");
  done();
});

let orderID;
describe("POST to /api/order", () => {
  it("responds with json", async (done) => {
    const res = await request
      .post("/api/order")
      .send({
        location_id: 1234567,
        dietary_restrictions: "Dairy",
        walking_home: false,
        pregnant: false,
        child_birthday: true,
      })
      .expect("Content-Type", /json/)
      .expect(201);
    const order = res.body;
    orderID = order.id;
    expect(order).toHaveProperty("id");
    expect(order).toHaveProperty("account_id", 1);
    expect(order).toHaveProperty("checkin_at");
    expect(order).toHaveProperty("checkout_at");
    expect(order).toHaveProperty("location_id", 1234567);
    expect(order).toHaveProperty("dietary_restrictions", "Dairy");
    expect(order).toHaveProperty("walking_home", false);
    expect(order).toHaveProperty("pregnant", false);
    expect(order).toHaveProperty("child_birthday", true);
    done();
  });
});

describe("GET to /api/order", () => {
  it("Respond with json", async (done) => {
    const res = await request
      .get("/api/order")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: orderID })])
    );
    done();
  });
});

describe("GET to /api/order/active", () => {
  it("Respond with json", async (done) => {
    const res = await request
      .get("/api/order/active")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: orderID })])
    );
    done();
  });
});

describe("PUT to /api/order/checkout/id", () => {
  it("Respond with json", async (done) => {
    const res = await request
      .put(`/api/order/checkout/${orderID}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: orderID })])
    );
    done();
  });
});

describe("GET to /api/order/complete/today", () => {
  it("Respond with json", async (done) => {
    const res = await request
      .get("/api/order/complete/today")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: orderID })])
    );
    done();
  });
});

describe("DELETE to /api/order/id", () => {
  it("Respond with 204 No Content", async (done) => {
    await request.delete(`/api/order/${orderID}`).expect(204);

    done();
  });
});
