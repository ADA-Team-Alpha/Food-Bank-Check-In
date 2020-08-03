const express = require('express');
const router = express.Router();
const pool = require("../modules/pool");

router.post('/', async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      id,
      description,
    } = req.body;
    await client.query("BEGIN");
    const locationInsertResults = await client.query(
      `INSERT INTO "location" ("id", "description")
      VALUES ($1, $2)`,
      [id, description]);
    await client.query('COMMIT');
    res.status(201).send(req.body);
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Error POST /api/location", error);
    res.sendStatus(500);
  }
});

router.get('/', (req, res) => {
  pool
    .query('SELECT * FROM "location";')
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("Error GET /api/location", error);
      res.sendStatus(500);
    });
})

router.delete("/:id", (req, res) => {
  let id = req.params.id;
  let queryText = `
    DELETE FROM location WHERE id = $1`;
  pool
    .query(queryText, [id])
    .then(() => res.sendStatus(204))
    .catch((error) => res.send(error));
});

module.exports = router;