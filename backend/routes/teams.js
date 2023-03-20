var express = require('express');
var router = express.Router();

const { all_teams, get_id, team_add, team_update, team_delete } = require("../controllers/teamsController");

router.post('/all_teams', all_teams);
router.post('/get_id', get_id);
router.post('/add', team_add);
router.post('/update', team_update);
router.post('/delete', team_delete);

module.exports = router;
