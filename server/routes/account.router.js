const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.get('/:id', (req, res) => {
  // TODO Hook up to a database.
  // const exampleObj = {

  // };
  // const queryText = 'INSERT INTO "game" ("bgg_game_id", "game_img", "title", "player_range", "playtime") VALUES ($1, $2, $3, $4, $5);';
  // pool.query(queryText, [gameID, artwork, title, playerRange, playTime])
  //   .then(queryResponse => res.send(queryResponse))
  //   .catch((error) => {
  //     console.log(error);
  //     res.sendStatus(500);
  //   });
  // res.status(200).send();
  res.sendStatus(200);
});

module.exports = router;
