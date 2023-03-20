var express = require('express');
var router = express.Router();
const db = require('../dbclient')
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', async function(req, res, next) {
  /* FUNCTION QUERIES */
  const query_SelectTime = `SELECT NOW()`;

  try {
    const db_query = await db.query(query_SelectTime, [])
    console.log(db_query.rows[0])
    res.render('index', { title: 'Express', locals:{query: db_query.rows[0] }});
  } catch (err) {
    console.log(err.stack)
    res.render('index', { title: 'Express', locals:{error: err.stack }});
  }

});

module.exports = router;
