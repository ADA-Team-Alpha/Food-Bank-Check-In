const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.get('/', (req, res) => {
  res.sendStatus(200);
});

router.post('/', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const queryText = 'INSERT INTO "account" ("name", "email", "password") VALUES ($1, $2, $3) returning "id", "name", "email", "password";';
  pool.query(queryText, [name, email, password])
    .then(queryResponse => res.send(queryResponse.rows))
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});

module.exports = router;
