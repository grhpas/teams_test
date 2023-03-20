var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
const db = require('../dbclient')
const {preregister, register, login} = require("../controllers/userController");

/* GET users listing (should remove in production). */
router.get('/', async function (req, res, next) {
  const queryUsers_all = `SELECT * FROM Users`;

  try {
    const db_query = await db.query(queryUsers_all, [])
    res.send(db_query.rows[0]);
  } catch (err) {
    res.send(err.stack);
  }

});

router.post('/preregister', preregister);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
