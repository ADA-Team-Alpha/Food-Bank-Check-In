const express = require('express');
const router = express.Router();
const {
  rejectUnauthenticated
} = require('../modules/authentication-middleware');
const pool = require('../modules/pool');

router.get('/', rejectUnauthenticated, async (req, res) => {
  const conn = await pool.connect();
  try {
    const query = {};
    query.text = `SELECT "order".*, account."name", account.email,
      profile.household_id, profile.last_pickup FROM "order"
      LEFT JOIN account ON "order".account_id = account.id
      LEFT JOIN profile ON account.id = profile.account_id;`;
    query.values = [];
    const result = await conn.query(query.text, query.values);
    res.status(200).send(result.rows);
  } catch (error) {
    console.log('Error GET /api/order', error);
    res.sendStatus(500);
  }
});

router.get('/active', rejectUnauthenticated, async (req, res) => {
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
    console.log('Error GET /api/order/active', error);
    res.sendStatus(500);
  }
});

router.get('/complete/today', rejectUnauthenticated, async (req, res) => {
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
    console.log('Error GET /api/order/active', error);
    res.sendStatus(500);
  }
});

router.post('/', rejectUnauthenticated, async (req, res) => {
  const accountID = req.user.id;

  const locationID = req.body.location_id;
  const dietaryRestrictions = req.body.dietary_restrictions;
  const walkingHome = req.body.walking_home;
  const pregnant = req.body.pregnant;
  const childBirthday = req.body.child_birthday;

  if (!locationID ||
    !dietaryRestrictions ||
    typeof walkingHome !== 'boolean' ||
    typeof pregnant !== 'boolean'  ||
    typeof childBirthday !== 'boolean'
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
      child_birthday
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;`;
    query.values = [
      accountID,
      locationID,
      dietaryRestrictions,
      walkingHome,
      pregnant,
      childBirthday
    ];
    await conn.query('BEGIN');
    const result = await conn.query(query.text, query.values);
    await conn.query('COMMIT');
    res.status(201).send(result.rows[0]);
  } catch (error) {
    await conn.query('ROLLBACK');
    console.log('Error POST /api/order', error);
    res.sendStatus(500);
  }
});

router.put('/checkout/:id', async (req, res) => {
  const conn = await pool.connect();
  try {
    const query = {};
    query.text = `UPDATE "order"
      SET checkout_at = NOW()
      WHERE id = $1
      RETURNING *;`;
    query.values = [req.params.id];
    await conn.query('BEGIN');
    const result = await conn.query(query.text, query.values);
    await conn.query('COMMIT');
    res.status(200).send(result.rows);
  } catch (error) {
    conn.query('ROLLBACK');
    console.log('Error PUT /api/order/checkout/id', error);
    res.sendStatus(500);
  }
});

router.delete('/:id', rejectUnauthenticated, async (req, res) => {
  const conn = await pool.connect();
  try {
    const query = {};
    query.text = 'DELETE FROM "order" WHERE id = $1;';
    query.values = [req.params.id];
    await conn.query(query.text, query.values);
    res.sendStatus(204);
  } catch (error) {
    console.log('Error PUT /api/order/checkout/id', error);
    res.sendStatus(500);
  }
});
// end DELETE

module.exports = router;
