const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");

// GET to /api/order
router.get("/", async (req, res) => {
  const conn = await pool.connect();
  try {
    const query = {};
		query.text = `SELECT "order".*, account."name", profile.household_id, profile.last_pickup FROM "order"
			LEFT JOIN account ON "order".account_id = account.id
			LEFT JOIN profile ON account.id = profile.account_id;`;
    query.values = [];
    const result = await conn.query(query.text, query.values);
    res.status(200).send(result.rows);
  } catch (error) {
    console.log(`Error GET /api/order/`, error);
    res.sendStatus(500);
  }
});

router.get("/active", async (req, res) => {
  const conn = await pool.connect();
  try {
    const query = {};
    query.text = `SELECT "order".*, account."name", profile.household_id, profile.last_pickup FROM "order"
			LEFT JOIN account ON "order".account_id = account.id
			LEFT JOIN profile ON account.id = profile.account_id 
			WHERE checkout_at IS NULL 
			ORDER BY checkin_at DESC;`;
    query.values = [];
    const result = await conn.query(query.text, query.values);
    res.status(200).send(result.rows);
  } catch (error) {
    console.log(`Error GET /api/order/active`, error);
    res.sendStatus(500);
  }
});

router.get("/complete/today", async (req, res) => {
  const conn = await pool.connect();
  try {
    const query = {};
    query.text = `SELECT "order".*, account."name", profile.household_id, profile.last_pickup FROM "order"
			LEFT JOIN account ON "order".account_id = account.id
			LEFT JOIN profile ON account.id = profile.account_id 
			WHERE checkout_at 
				BETWEEN NOW() - INTERVAL '24 HOURS' 
				AND NOW()
			ORDER BY checkout_at DESC;`;
		query.values = [];
		const result = await conn.query(query.text, query.values);
		res.status(200).send(result.rows);
	} catch (error) {
		console.log(`Error GET /api/order/complete/today`, error);
		res.sendStatus(500);
	}
});
// end GET

// POST api/order
router.post("/", async (req, res) => {
  const conn = await pool.connect();
  try {
    const query = {};
    query.text = `INSERT INTO "order" (
			account_id,
			location_id,
			dietary_restrictions,
			walking_home,
			pregnant,
			child_birthday
			)
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING *;`;
    query.values = [
      45,
      req.body.location_id,
      req.body.dietary_restrictions,
      req.body.walking_home,
      req.body.pregnant,
      req.body.child_birthday,
    ];
    await conn.query("BEGIN");
    const result = await conn.query(query.text, query.values);
    await conn.query("COMMIT");
    res.status(201).send(result.rows[0]);
  } catch (error) {
    await conn.query("ROLLBACK");
    console.log(`Error POST /api/order/`, error);
    res.sendStatus(500);
  }
});
// end POST

// PUT /api/order/checkout/id
router.put("/checkout/:id", async (req, res) => {
  const conn = await pool.connect();
  try {
    const query = {};
    query.text = `UPDATE "order"
			SET checkout_at = NOW()
			WHERE id = $1
			RETURNING *;`;
    query.values = [req.params.id];
    conn.query("BEGIN");
    const result = await conn.query(query.text, query.values);
    conn.query("COMMIT");
    res.status(200).send(result.rows);
  } catch (error) {
    conn.query("ROLLBACK");
    console.log(`Error PUT /api/order/checkout/id`, error);
    res.sendStatus(500);
  }
});
// end PUT

// DELETE to /api/order/:id
router.delete("/:id", async (req, res) => {
  const conn = await pool.connect();
  try {
    const query = {};
    query.text = `DELETE FROM "order" WHERE id = $1;`;
    query.values = [req.params.id];
    await conn.query(query.text, query.values);
    res.sendStatus(204);
  } catch (error) {
    console.log(`Error PUT /api/order/checkout/id`, error);
    res.sendStatus(500);
  }
});
// end DELETE

module.exports = router;
