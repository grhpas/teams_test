var express = require('express');
var router = express.Router();

const { all_players, get_id, player_add, player_update, player_delete, player_injured } = require("../controllers/playersController");

router.post('/all_players', all_players);
router.post('/get_id', get_id);
router.post('/add', player_add);
router.post('/update', player_update);
router.post('/delete', player_delete);
router.post('/injured', player_injured);

module.exports = router;
