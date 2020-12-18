const express = require("express");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");
const sqlSelect = require('../sql/sqlSelects');

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
    res.status(200).send(result.rows);
  } catch (error) {
    console.log("Error GET /api/order", error);
    res.sendStatus(500);
  } finally {
    conn.release();
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
    res.status(200).send(result.rows);
  } catch (error) {
    console.log("Error GET /api/order/active", error);
    res.sendStatus(500);
  } finally {
    conn.release();
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
                                    AND wait_time_minutes IS NOT NULL
                                    ORDER BY checkin_at DESC;`);
    res.status(200).send(result.rows);
  } catch (error) {
    console.log("Error GET /api/order/active", error);
    res.sendStatus(500);
  } finally {
    conn.release();
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
    query.text = sqlSelect.user.getOrdersFromToday;
    query.values = [id];
    const result = await conn.query(query.text, query.values);
    res.status(200).send(result.rows);
  } catch (error) {
    console.log("Error GET /api/order/active", error);
    res.sendStatus(500);
  } finally {
    conn.release();
  }
});

/*
	POST /api/order/ adds a new order to the database.
*/
router.post("/", rejectUnauthenticated, async (req, res) => {
  const accountApproved = req.user.approved;
  if (!accountApproved) {
    res.sendStatus(403);
    return;
  }

  let accountID = req.user.id;
  const householdID = req.body.household_id;
  const clientName = req.body.client_name;

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

  // If the current user doesn't have a high enough access level return unauthorized.
  if (accessLevel >= 10) {
    if (!clientName || !householdID) {
      res.sendStatus(400);
      return;
    }

    try {
      waitTimeMinutes = Number(req.body.wait_time_minutes);
    } catch (error) {
      res.sendStatus(400);
      return;
    }

    const connection = await pool.connect();
    try {
      const getUserIDQuery = {
        text: `SELECT account.id, account."name",
              account.active, account.approved,
              profile.household_id FROM account
              LEFT JOIN profile ON account.id = profile.account_id
              WHERE account."name" ILIKE $1
              AND profile.household_id ILIKE $2;`,
        values: [clientName, householdID]
      };
      const result = await connection.query(
        getUserIDQuery.text,
        getUserIDQuery.values
      );
      const clientObj = result.rows && result.rows[0];
      if (clientObj) {
        accountID = clientObj.id;
      } else {
        res.sendStatus(404);
        return;
      }
      if (clientObj.active === false || clientObj.approved === false) {
        res.sendStatus(405);
        return;
      }
    } catch (error) {
      res.sendStatus(400);
      return;
    } finally {
      connection.release();
    }
  }

  const connect = await pool.connect();
  try {
    // Check to see if this client already placed an order today and if so decline it.
    const query = {
      text: sqlSelect.user.getOrdersFromToday,
      values: [accountID]
    };
    const latestOrder = await connect.query(query.text, query.values);
    if (latestOrder[0]) {
      res.sendStatus(403);
      return;
    }
  } catch (error) {
    res.sendStatus(500);
    return;
  } finally {
    connect.release();
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
    // do a second query that updates the user's profile to include the latest order
    const updateProfileLatestOrderQuery = {};
    updateProfileLatestOrderQuery.text = `UPDATE "profile"
      SET latest_order = $1
      WHERE account_id = $2;`;
    updateProfileLatestOrderQuery.values = [
      result.rows[0].id,
      accountID
    ];
    await conn.query(
      updateProfileLatestOrderQuery.text,
      updateProfileLatestOrderQuery.values
    );
    await conn.query("COMMIT");
    res.status(201).send(result.rows[0]);
  } catch (error) {
    await conn.query("ROLLBACK");
    console.log("Error POST /api/order", error);
    res.sendStatus(500);
  } finally {
    conn.release();
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
  if (req.body.wait_time_minutes !== null) {
    try {
      waitTimeMinutes = Number(req.body.wait_time_minutes);
    } catch (error) {
      res.sendStatus(400);
      return;
    }
  } else {
    waitTimeMinutes = null;
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
    await conn.query("COMMIT");
    res.status(200).send(result.rows);
  } catch (error) {
    conn.query("ROLLBACK");
    console.log("Error PUT /api/order/checkout/id", error);
    res.sendStatus(500);
  } finally {
    conn.release();
  }
});

/*
	PUT /api/order/date/:id updates the checkin and checkout date of the order
*/
router.put("/date/:id", async (req, res) => {
  const accessLevel = req.user.access_level;
  // If the current user doesn't have a high enough access level return unauthorized.
  if (accessLevel < 10) {
    res.sendStatus(401);
    return;
  }

  const conn = await pool.connect();
  try {
    const query = {};
    const date = req.body.date;
    const [year, month, day] = [...date.split('-')];

    query.text = `SELECT checkin_at, checkout_at 
      FROM "order"
      WHERE id = $1;`;
    query.values = [req.params.id];
    const results = await conn.query(query.text, query.values);
    let checkout = new Date(results.rows[0].checkout_at);
    let checkin = new Date(results.rows[0].checkin_at);

    if (checkin) {
      checkin.setFullYear(year);
      checkin.setDate(day);
      checkin.setMonth(month - 1);
    } 

    if (checkout) {
      checkout.setFullYear(year);
      checkout.setDate(day);
      checkout.setMonth(month - 1);
    } 
    
    query.text = `UPDATE "order"
      SET checkout_at = $1, checkin_at = $2
      WHERE id = $3;`;
    query.values = [checkout, checkin, req.params.id];
    await conn.query(query.text, query.values);
    res.sendStatus(200);
  } catch (error) {
    console.log("Error PUT /api/order/date/id", error);
    res.sendStatus(500);
  } finally {
    conn.release();
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
    res.sendStatus(204);
  } catch (error) {
    console.log("Error PUT /api/order/checkout/id", error);
    res.sendStatus(500);
  } finally {
    conn.release();
  }
});
// end DELETE

module.exports = router;
