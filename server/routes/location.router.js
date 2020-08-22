const express = require("express");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");


/*
	POST /api/location allows users with sufficient access level to add locations that 
	users can select when checking in. ID must be specified by the request.
*/
router.post("/", rejectUnauthenticated, async (req, res) => {
  const id = req.body.id;
  const description = req.body.description;

  const accessLevel = req.user.access_level;
  // If the current user doesn't have a high enough access level return unauthorized.
  if (accessLevel < 10) {
    res.sendStatus(401);
    return;
  }

	// if the request does not contain the required information return Bad Request
  if (!id || !description) {
    res.sendStatus(400);
    return;
  }

  const conn = await pool.connect();
  try {
    const query = {};
    query.text =
      'INSERT INTO "location" ("id", "description") VALUES ($1, $2) RETURNING *;';
    query.values = [id, description];
    await conn.query("BEGIN");
    const locationInsertResults = await conn.query(query.text, query.values);
    await conn.query("COMMIT");
    conn.release(); // required so we don't use up the entire connection pool
    res.status(201).send(locationInsertResults.rows[0]);
  } catch (error) {
		await conn.query("ROLLBACK");
		conn.release();
    console.log("Error POST /api/location", error);
    res.sendStatus(500);
  }
});

/*
	PUT /api/location/:id edits a previously created location. ID's are mutable.
*/
router.put("/:id", rejectUnauthenticated, async (req, res) => {
  const id = req.params.id;
  const description = req.body.description;

  const accessLevel = req.user.access_level;
  // If the current user doesn't have a high enough access level return unauthorized.
  if (accessLevel < 10) {
    res.sendStatus(401);
    return;
  }

	// if the request does not contain the required information return Bad Request
  if (!id || !description) {
    res.sendStatus(400);
    return;
  }

  const conn = await pool.connect();
  try {
    const query = {};
    query.text =
      "UPDATE location SET description = $1 WHERE id = $2 RETURNING *;";
    query.values = [description, id];
    await conn.query("BEGIN");
    const result = await conn.query(query.text, query.values);
    await conn.query("COMMIT");
    conn.release();
    res.status(200).send(result.rows[0]);
  } catch (error) {
		conn.query("ROLLBACK");
		conn.release();
    console.log(`Error PUT /api/location/${id}`, error);
    res.sendStatus(500);
  }
});

/*
	GET /api/location/ returns a list of all locations in the database ordered by ID
*/
router.get("/", async (req, res) => {
  const conn = await pool.connect();
  try {
    const query = {};
    query.text = 'SELECT * FROM "location" ORDER BY id ASC;';
    await conn.query("BEGIN");
    const result = await conn.query(query.text);
    await conn.query("COMMIT");
    conn.release();
    res.status(200).send(result.rows);
  } catch (error) {
		conn.query("ROLLBACK");
		conn.release();
    console.log("Error GET /api/location/", error);
    res.sendStatus(500);
  }
});

/*
	DELETE /api/location/:id deletes a previously created location from the database. 
	THIS CANNOT BE UNDONE, but it is a pretty simple object anyway so it's not a huge deal.
*/
router.delete("/:id", rejectUnauthenticated, async (req, res) => {
  const id = req.params.id;

  const accessLevel = req.user.access_level;
  // If the current user doesn't have a high enough access level return unauthorized.
  if (accessLevel < 10) {
    res.sendStatus(401);
    return;
  }

  const conn = await pool.connect();
  try {
    const query = {};
    query.text = "DELETE FROM location WHERE id = $1;";
    query.values = [id];
    await conn.query("BEGIN");
    await conn.query(query.text, query.values);
    await conn.query("COMMIT");
    conn.release();
    res.sendStatus(204);
  } catch (error) {
		conn.query("ROLLBACK");
		conn.release();
    console.log(`Error DELETE /api/location/${id}`, error);
    res.sendStatus(500);
  } 
});

module.exports = router;
