const express = require('express');
const router = express.Router();
const {
  rejectUnauthenticated
} = require('../modules/authentication-middleware');
const pool = require('../modules/pool');

router.post('/', rejectUnauthenticated, async (req, res) => {
  const id = req.body.id;
  const description = req.body.description;

  const accessLevel = req.user.access_level;
  if (accessLevel < 10) {
    res.sendStatus(401);
    return;
  }

  if (!id || !description) {
    res.sendStatus(400);
    return;
  }

  const conn = await pool.connect();
  try {
    const query = {};
    query.text = 'INSERT INTO "location" ("id", "description") VALUES ($1, $2) RETURNING *;';
    query.values = [id, description];
    await conn.query('BEGIN');
    const locationInsertResults = await conn.query(query.text, query.values);
    await conn.query('COMMIT');
    res.status(200).send(locationInsertResults.rows[0]);
  } catch (error) {
    await conn.query('ROLLBACK');
    console.log('Error POST /api/location', error);
    res.sendStatus(500);
  }
});

router.put('/:id', rejectUnauthenticated, async (req, res) => {
  const id = req.params.id;
  const description = req.body.description;

  const accessLevel = req.user.access_level;
  if (accessLevel < 10) {
    res.sendStatus(401);
    return;
  }

  if (!id || !description) {
    res.sendStatus(400);
    return;
  }

  const conn = await pool.connect();
  try {
    const query = {};
    query.text = 'UPDATE location SET description = $1 WHERE id = $2 RETURNING *;';
    query.values = [description, id];
    await conn.query('BEGIN');
    const result = await conn.query(query.text, query.values);
    await conn.query('COMMIT');
    res.status(200).send(result.rows[0]);
  } catch (error) {
    conn.query('ROLLBACK');
    console.log(`Error PUT /api/location/${id}`, error);
    res.sendStatus(500);
  }
});

router.get('/', async (req, res) => {
  const conn = await pool.connect();
  try {
    const query = {};
    query.text = 'SELECT * FROM "location";';
    await conn.query('BEGIN');
    const result = await conn.query(query.text);
    await conn.query('COMMIT');
    res.status(200).send(result.rows);
  } catch (error) {
    conn.query('ROLLBACK');
    console.log('Error GET /api/location/', error);
    res.sendStatus(500);
  }
});

router.delete('/:id', rejectUnauthenticated, async (req, res) => {
  const id = req.params.id;

  const accessLevel = req.user.access_level;
  if (accessLevel < 10) {
    res.sendStatus(401);
    return;
  }

  const conn = await pool.connect();
  try {
    const query = {};
    query.text = 'DELETE FROM location WHERE id = $1;';
    query.values = [id];
    await conn.query('BEGIN');
    await conn.query(query.text);
    await conn.query('COMMIT');
    res.sentStatus(204);
  } catch (error) {
    conn.query('ROLLBACK');
    console.log('Error DELETE /api/location/', error);
    res.sendStatus(500);
  }
});

module.exports = router;
