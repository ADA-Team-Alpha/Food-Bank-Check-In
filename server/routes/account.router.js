const express = require('express');
const router = express.Router();
const {
  rejectUnauthenticated
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const sqlSelect = require('../sql/sqlSelects');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Handles Ajax request for user information if user is authenticated/signed in.
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back the user object from the session (previously queried from the database).
  res.send(req.user);
});

// An admin can get all the information about a client by doing a get request with the account id.
// As of version one there is no interface for doing this though.
router.get('/:id', rejectUnauthenticated, async (req, res) => {
  const accessLevel = req.user.access_level;
  // If the current user doesn't have a high enough access level return unauthorized.
  if (accessLevel < 100) {
    res.sendStatus(403);
    return;
  }
  const id = req.params.id;
  const conn = await pool.connect();
  try {
    const query = {};
    query.text = sqlSelect.user.getUserInfoQuery;
    query.values = [id];
    const result = await conn.query(query.text, query.values);
    if (result.rows[0]) {
      res.status(200).send(result.rows[0]);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.log(`Error GET /api/account/${id}`, error);
    res.sendStatus(500);
  } finally {
    conn.release();
  }
});

// An admin can get all the information about a client by doing a get request with the account id.
// As of version one there is no interface for doing this though.
router.get('/search/:name/:householdID', rejectUnauthenticated, async (req, res) => {
  const accessLevel = req.user.access_level;
  const name = req.params.name;
  const householdID = req.params.householdID;

  if (accessLevel < 10) {
    res.sendStatus(403);
    return;
  }

  if (
    typeof name !== "string" ||
    typeof householdID !== "string"
  ) {
    res.sendStatus(400);
    return;
  }

  const conn = await pool.connect();
  try {
    const query = {
      text: `SELECT account.id, account."name",
            account.active, account.approved,
            profile.household_id, profile.latest_order FROM account
            LEFT JOIN profile ON account.id = profile.account_id
            WHERE account."name" ILIKE $1
            AND profile.household_id ILIKE $2;`,
      values: [`%${name}%`, `%${householdID}%`]
    };

    const result = await conn.query(query.text, query.values);
    let returnClientInfoObj;
    if (result.rows[0]) {
      if (result.rows.length > 1) {
        res.sendStatus(204);
        return;
      }
      returnClientInfoObj = result.rows[0];
      if (returnClientInfoObj.latest_order) {
        const connect = await pool.connect();
        try {
          const getLatestOrderObjectQuery = {
            text: 'SELECT * FROM "order" WHERE id = $1;',
            values: [returnClientInfoObj.latest_order]
          };
          const orderRow = await conn.query(getLatestOrderObjectQuery.text, getLatestOrderObjectQuery.values);
          returnClientInfoObj = { ...returnClientInfoObj, latest_order: orderRow.rows[0] ? orderRow.rows[0] : null };
        } catch (error) {
          res.sendStatus(404);
        } finally {
          connect.release();
        }
      }
    }
    res.status(200).send(returnClientInfoObj);
  } catch (error) {
    console.log(`Error GET /api/account/${name}/${householdID}`, error);
    res.sendStatus(500);
  } finally {
    conn.release();
  }
});

router.get('/pending/approval', rejectUnauthenticated, async (req, res) => {
  const accessLevel = req.user.access_level;
  // If the current user doesn't have a high enough access level return unauthorized.
  if (accessLevel < 10) {
    res.sendStatus(403);
    return;
  }
  const conn = await pool.connect();
  try {
    const result = await conn.query(`SELECT account.id, account."name", account.email, profile.household_id
                                     FROM account LEFT JOIN profile ON account.id = profile.account_id
                                     WHERE account.approved = FALSE AND account.active = TRUE;`);
    res.status(200).send(result.rows);
  } catch (error) {
    console.log('Error GET /api/account/pending-approval', error);
    res.sendStatus(500);
  } finally {
    conn.release();
  }
});

// Handles POST request when a new user signs up.
// As of version one anyone can sign up just by registering.
router.post('/', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const houseId = req.body.household_id;
  if (!name || !email || !houseId || !req.body.password) {
    res.sendStatus(400);
    return;
  }
  const password = encryptLib.encryptPassword(req.body.password);
  const conn = await pool.connect();
  try {
    const profileQuery = {};
    profileQuery.text = `INSERT INTO "account" (name, email, password)
                         VALUES ($1, $2, $3)
                         RETURNING id;`;
    profileQuery.values = [name, email, password];
    await conn.query('BEGIN');
    const result = await conn.query(profileQuery.text, profileQuery.values);
    const accountQuery = {};
    accountQuery.text = `INSERT INTO "profile" (account_id, household_id)
                         VALUES ($1, $2) RETURNING account_id`;
    accountQuery.values = [result.rows[0].id, houseId];
    await conn.query(accountQuery.text, accountQuery.values);
    await conn.query('COMMIT');
    res.status(200).send(result.rows[0]);
  } catch (error) {
    conn.query('ROLLBACK');
    console.log('Error POST /account', error);
    res.sendStatus(500);
  } finally {
    conn.release();
  }
});

// A volunteer can either decline or accept an account request.
router.put('/:id', rejectUnauthenticated, async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const email = req.body.email;
  const accessLevel = req.body.access_level;
  const active = req.body.active;
  const approved = req.body.approved;

  if (req.user.access_level < 100) {
    res.sendStatus(403);
    return;
  }

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof accessLevel !== 'number' ||
    typeof active !== 'boolean' ||
    typeof approved !== 'boolean'
  ) {
    res.sendStatus(400);
    return;
  }

  const conn = await pool.connect();
  try {
    const query = {};
    query.text = `UPDATE "account" SET "name" = $1, "email" = $2, "access_level" = $3,
                  "active" = $4, "approved" = $5 WHERE id = $6 
                  RETURNING id, "name", email, access_level, active, approved;`;
    query.values = [name, email, accessLevel, active, approved, id];
    await conn.query('BEGIN');
    const result = await conn.query(query.text, query.values);
    await conn.query('COMMIT');
    res.status(200).send(result.rows && result.rows[0]);
  } catch (error) {
    conn.query('ROLLBACK');
    console.log('Error PUT /account', error);
    res.sendStatus(500);
  } finally {
    conn.release();
  }
});

router.put('/update-approved/:id', rejectUnauthenticated, async (req, res) => {
  const id = req.params.id;
  const approved = req.body.approved;

  if (req.user.access_level < 10) {
    res.sendStatus(403);
    return;
  }
  if (
    typeof approved !== 'boolean'
  ) {
    res.sendStatus(400);
    return;
  }
  const conn = await pool.connect();
  try {
    const query = {};
    if (approved) {
      query.text = `UPDATE "account" SET "approved" = TRUE WHERE id = $1
                    RETURNING id, "name", email, access_level, active, approved;`;
    } else {
      query.text = `UPDATE "account" SET "active" = FALSE WHERE id = $1
                    RETURNING id, "name", email, access_level, active, approved;`;
    }
    query.values = [id];
    await conn.query('BEGIN');
    const result = await conn.query(query.text, query.values);
    await conn.query('COMMIT');
    res.status(200).send(result.rows && result.rows[0]);
  } catch (error) {
    conn.query('ROLLBACK');
    console.log('Error PUT /account', error);
    res.sendStatus(500);
  } finally {
    conn.release();
  }
});

router.delete('/:id', rejectUnauthenticated, async (req, res) => {
  const accessLevel = req.user.access_level;
  // If the current user doesn't have a high enough access level return unauthorized.
  if (accessLevel < 100) {
    res.sendStatus(403);
    return;
  }
  const id = req.params.id;
  const conn = await pool.connect();
  try {
    const query = {};
    query.text = 'UPDATE account SET active = false WHERE "id" = $1;';
    query.values = [id];
    await conn.query('BEGIN');
    await conn.query(query.text, query.values);
    await conn.query('COMMIT');
    res.sendStatus(204);
  } catch (error) {
    conn.query('ROLLBACK');
    console.log('Error DELETE /account', error);
    res.sendStatus(500);
  } finally {
    conn.release();
  }
});

// Handles POST request when a new user signs up.
// As of version one anyone can sign up just by registering.
router.post('/forgot', async (req, res) => {
  const email = req.body.email;
  if (!email) {
    res.sendStatus(400);
    return;
  }
  const conn = await pool.connect();
  try {
    const profileQuery = {};
    profileQuery.text = `SELECT id, name FROM "account" 
                         WHERE email = $1;`;
    profileQuery.values = [email];
    const result = await conn.query(profileQuery.text, profileQuery.values);
    if (typeof result.rows[0] !== 'undefined') { //does the user exist?
      const resetToken = encryptLib.generateToken(20);
      const expirationDate = new Date(Date.now() + 3600000);
      profileQuery.text = `UPDATE account SET 
                              reset_password_token = $1, 
                              reset_password_expires = $2 
                              WHERE id = $3`; 
      profileQuery.values = [resetToken, expirationDate, result.rows[0].id];
      await conn.query('BEGIN');
      await conn.query(profileQuery.text, profileQuery.values);
      await conn.query('COMMIT');

      //send email
      const msg = {
        to: 'tyler.persons@codelation.com', // Change to your recipient
        from: 'tyler.persons@codelation.com', // Change to your verified sender
        subject: 'Emergency Food Pantry Password Reset',
        html: `Click <a href='${process.env.HOST}/api/account/forgot/${resetToken}'>here</a> to reset your password.`,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
    }
    res.status(200).send(result.rows[0]);
  } catch (error) {
    conn.query('ROLLBACK');
    console.log('Error POST /account/forgot', error);
    res.sendStatus(500);
  } finally {
    conn.release();
  }
});


// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
