const express = require("express");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

/*
	GET /api/order/ requests ALL orders in the database
*/
router.get("/", rejectUnauthenticated, async (req, res) => {
  const accessLevel = req.user.access_level;
  // If the current user doesn't have a high enough access level return unauthorized.
  if (accessLevel < 10) {
    res.sendStatus(401);
    return;
  }
  const conn = await pool.connect();
  try {
    const result = await conn.query(`SELECT "order".*, account."name", account.email,
      profile.household_id, profile.latest_order FROM "order"
      LEFT JOIN account ON "order".account_id = account.id
      LEFT JOIN profile ON account.id = profile.account_id;`);
    conn.release();
    res.status(200).send(result.rows);
  } catch (error) {
    console.log("Error GET /api/order", error);
    res.sendStatus(500);
  }
});

/*
	GET /api/order/active requests all active orders in the database (not checked out)
*/
router.get("/active", rejectUnauthenticated, async (req, res) => {
  const accessLevel = req.user.access_level;
  // If the current user doesn't have a high enough access level return unauthorized.
  if (accessLevel < 10) {
    res.sendStatus(401);
    return;
  }
  const conn = await pool.connect();
  try {
    const result = await conn.query(`SELECT "order".*, account."name",
                                    profile.household_id, profile.latest_order FROM "order"
                                    LEFT JOIN account ON "order".account_id = account.id
                                    LEFT JOIN profile ON account.id = profile.account_id 
                                    WHERE cast(checkin_at as date) = CURRENT_DATE
                                    AND checkout_at IS NULL
                                    ORDER BY checkin_at DESC;`);
    conn.release();
    res.status(200).send(result.rows);
  } catch (error) {
    console.log("Error GET /api/order/active", error);
    res.sendStatus(500);
  }
});

/*
	GET /api/order/complete/today requests orders that have been checked out on the current date
*/
router.get("/complete/today", rejectUnauthenticated, async (req, res) => {
  const accessLevel = req.user.access_level;
  // If the current user doesn't have a high enough access level return unauthorized.
  if (accessLevel < 10) {
    res.sendStatus(401);
    return;
  }
  const conn = await pool.connect();
  try {
    const result = await conn.query(`SELECT "order".*, account."name",
                                    profile.household_id, profile.latest_order FROM "order"
                                    LEFT JOIN account ON "order".account_id = account.id
                                    LEFT JOIN profile ON account.id = profile.account_id 
                                    WHERE cast(checkin_at as date) = CURRENT_DATE
                                    AND checkout_at IS NOT NULL
                                    ORDER BY checkin_at DESC;`);
    conn.release();
    res.status(200).send(result.rows);
  } catch (error) {
    console.log("Error GET /api/order/active", error);
    res.sendStatus(500);
  }
});

/*
	GET /api/order/client-order-status requests the status of an order to see when it has been confirmed by staff
*/
router.get("/client-order-status", async (req, res) => {
  const id = req.user.id;
  const conn = await pool.connect();
  try {
    const query = {};
    query.text = `SELECT "order".* FROM "order"
                  WHERE cast(checkin_at as date) = CURRENT_DATE
                  AND "order".account_id = $1
                  ORDER BY checkin_at DESC;`;
    query.values = [id];
    const result = await conn.query(query.text, query.values);
    conn.release();
    res.status(200).send(result.rows);
  } catch (error) {
    console.log("Error GET /api/order/active", error);
    res.sendStatus(500);
  }
});

/*
	POST /api/order/ adds a new order to the database.
*/
router.post("/", rejectUnauthenticated, async (req, res) => {
  const accountID = req.user.id;
  const accessLevel = req.user.access_level;

  const locationID = req.body.location_id;
  const dietaryRestrictions = req.body.dietary_restrictions;
  const walkingHome = req.body.walking_home;
  const pregnant = req.body.pregnant;
  const childBirthday = req.body.child_birthday;
  const snap = req.body.snap;
  const pickupName = req.body.pickup_name;
  const other = req.body.other;
  let waitTimeMinutes = null;

  // If the current user doesn't have a high enough access level return unauthorized.
  if (accessLevel >= 10) {
    try {
      waitTimeMinutes = Number(req.body.wait_time_minutes);
    } catch (error) {
      res.sendStatus(400);
      return;
    }
  }

  // TODO only allow volunteers to specify the wait time.
  if (
    !locationID ||
    typeof dietaryRestrictions !== "string" ||
    typeof walkingHome !== "boolean" ||
    typeof pregnant !== "boolean" ||
    typeof childBirthday !== "boolean" ||
    typeof snap !== "boolean" ||
    typeof pickupName !== "string" ||
    typeof other !== "string"
  ) {
    res.sendStatus(400);
    return;
  }

  const conn = await pool.connect();
  try {
    const query = {};
    query.text = `INSERT INTO "order" (
      account_id,
      location_id,
      dietary_restrictions,
      walking_home,
      pregnant,
      child_birthday,
      snap,
      pickup_name,
      other,
      wait_time_minutes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;`;
    query.values = [
      accountID,
      locationID,
      dietaryRestrictions,
      walkingHome,
      pregnant,
      childBirthday,
      snap,
      pickupName,
      other,
      waitTimeMinutes,
    ];
    await conn.query("BEGIN");
    const result = await conn.query(query.text, query.values);
    await conn.query("COMMIT");
    conn.release();
    res.status(201).send(result.rows[0]);
  } catch (error) {
    await conn.query("ROLLBACK");
    console.log("Error POST /api/order", error);
    res.sendStatus(500);
  }
});

/*
	PUT /api/order/checkout/:id marks an order as checked out and adds a wait time attribute to the order
*/
router.put("/checkout/:id", async (req, res) => {
  const accessLevel = req.user.access_level;
  // If the current user doesn't have a high enough access level return unauthorized.
  if (accessLevel < 10) {
    res.sendStatus(401);
    return;
  }
  let waitTimeMinutes;
  try {
    waitTimeMinutes = Number(req.body.wait_time_minutes);
  } catch (error) {
    res.sendStatus(400);
    return;
  }

  const conn = await pool.connect();
  try {
    const placeOrderQuery = {};
    placeOrderQuery.text = `UPDATE "order"
      SET checkout_at = NOW(), wait_time_minutes = $2
      WHERE id = $1
      RETURNING *;`;
    placeOrderQuery.values = [req.params.id, waitTimeMinutes];
    await conn.query("BEGIN");
    const result = await conn.query(
      placeOrderQuery.text,
      placeOrderQuery.values
    );
    // do a second query that updates the user's profile to include the latest order
    const updateProfileLatestOrderQuery = {};
    updateProfileLatestOrderQuery.text = `UPDATE "profile"
      SET latest_order = $1
      WHERE account_id = $2;`;
    updateProfileLatestOrderQuery.values = [
      result.rows[0].id,
      result.rows[0].account_id,
    ];
    await conn.query(
      updateProfileLatestOrderQuery.text,
      updateProfileLatestOrderQuery.values
    );
    await conn.query("COMMIT");
    conn.release();
    res.status(200).send(result.rows);
  } catch (error) {
    conn.query("ROLLBACK");
    console.log("Error PUT /api/order/checkout/id", error);
    res.sendStatus(500);
  }
});

/*
	DELETE /api/order/:id deletes an order from the database. Admin only
*/
router.delete("/:id", rejectUnauthenticated, async (req, res) => {
  const accessLevel = req.user.access_level;
  // If the current user doesn't have a high enough access level return unauthorized.
  if (accessLevel < 100) {
    res.sendStatus(401);
    return;
  }
  const conn = await pool.connect();
  try {
    const query = {};
    query.text = 'DELETE FROM "order" WHERE id = $1;';
    query.values = [req.params.id];
    await conn.query(query.text, query.values);
    conn.release();
    res.sendStatus(204);
  } catch (error) {
    console.log("Error PUT /api/order/checkout/id", error);
    res.sendStatus(500);
  }
});
// end DELETE

module.exports = router;
