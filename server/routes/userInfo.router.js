const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {rejectUnauthenticated} = require('../modules/authentication-middleware');
const { useRadioGroup } = require('@material-ui/core');

//Get Route
router.get('/', rejectUnauthenticated, (req, res) => {
  //query to grab all users and their info
    const queryText = `SELECT * FROM "user" ORDER BY username ASC;`;
    pool.query(queryText).then((result) => {
      res.send(result.rows);
    }).catch((error) => {
      console.log('error in GET', error);
      res.sendStatus(500);
    })
  });

  //Delete Route - Delete an admin user
router.delete('/:id', rejectUnauthenticated, (req, res) => {
  console.log('in userInfo.router req.params.id -->', req.params.id);
  if (req.user.id == '1') {
  const queryText = `DELETE FROM "user" WHERE "id" = $1;`;
  pool.query(queryText, [req.params.id])
  .then(result => {
    res.sendStatus(200)
  })
  .catch((error) => {
    console.log('error in admin DELETE in server', error);
  });
} else {
  console.log('unable to delete unless you are superuser');
  res.sendStatus(403);
}
});

  module.exports = router;