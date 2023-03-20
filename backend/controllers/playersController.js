const db = require('../dbclient');
const jwt = require('jsonwebtoken');


const all_players = async (req, res) => {
    // Queries
    const queryPlayers_getbyteam = `SELECT * FROM Players WHERE TeamID = $1 ORDER BY PlayerID`;
    const queryTeams_getteam = `SELECT * FROM Teams WHERE TeamID = $1 AND ManagerID = $2`;

    // Main
    const {token, teamid} = req.body;
    try {
        // Token Expiration set to 30 days, because reasons
        const decoded = jwt.verify(token, db.SECRET_KEY, {maxAge: "30d"});
        const user_id = decoded["id"];

        const dbq_team = await db.query(queryTeams_getteam, [teamid, user_id])
        if (dbq_team.rowCount > 0)  {
            const dbq_player = await db.query(queryPlayers_getbyteam, [teamid])
            return res.status(200).json({players: dbq_player.rows});
        }

        return res.status(403).json({message: "You cannot access this Team."});
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "Token Expired"});
        }
        console.log(err.stack);
        return res.status(406).json({message: "Something went wrong here!"});
    }
}

const get_id = async (req, res) => {
    // Queries
    const queryPlayers_getplayer = `SELECT * FROM Players WHERE PlayerID = $1`;
    const queryTeams_getteam = `SELECT * FROM Teams WHERE TeamID = $1 AND ManagerID = $2`;

    // Main
    const {token, id} = req.body;
    try {
        // Token Expiration set to 30 days, because reasons
        const decoded = jwt.verify(token, db.SECRET_KEY, {maxAge: "30d"});
        const user_id = decoded["id"];

        const dbq_player = await db.query(queryPlayers_getplayer, [id])
        if (dbq_player.rowCount > 0)  {
            const teamid = dbq_player.rows[0]["teamid"];
            const dbq_team = await db.query(queryTeams_getteam, [teamid, user_id])
            if (dbq_team.rowCount > 0)  {
                return res.status(200).json(dbq_player.rows[0]);
            }
        }

        return res.status(403).json({message: "No Player that you can access with that ID"});
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "Token Expired"});
        }
        return res.status(406).json({message: "Something went wrong here!"});
    }
}

const player_add = async (req, res) => {
    // Queries
    const queryPlayers_addplayer = `INSERT INTO Players (TeamID, name, injured, active) VALUES ($1, $2, $3, True) RETURNING *`;
    const queryTeams_getteam = `SELECT * FROM Teams WHERE TeamID = $1 AND ManagerID = $2`;

    // Main
    const {token, teamid, name, injured} = req.body;
    try {
        // Token Expiration set to 30 days, because reasons
        const decoded = jwt.verify(token, db.SECRET_KEY, {maxAge: "30d"});
        const user_id = decoded["id"];

        const dbq_team = await db.query(queryTeams_getteam, [teamid, user_id])
        if (dbq_team.rowCount > 0) {
            const dbq_player = await db.query(queryPlayers_addplayer, [teamid, name, injured])
            if (dbq_player.rowCount > 0) {
                return res.status(200).json(dbq_player.rows[0]);
            }
        }

        return res.status(403).json({message: "Creation Failed"});
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "Token Expired"});
        }
        return res.status(406).json({message: "Something went wrong here!"});
    }
}

const player_update = async (req, res) => {
    // Queries
    const queryPlayers_updateplayer = `UPDATE Players SET name = $1 WHERE PlayerID = $2 RETURNING *`;
    const queryPlayers_getplayer = `SELECT * FROM Players WHERE PlayerID = $1`;
    const queryTeams_getteam = `SELECT * FROM Teams WHERE TeamID = $1 AND ManagerID = $2`;

    // Main
    const {token, name, id} = req.body;
    try {
        // Token Expiration set to 30 days, because reasons
        const decoded = jwt.verify(token, db.SECRET_KEY, {maxAge: "30d"});
        const user_id = decoded["id"];

        const dbq_player = await db.query(queryPlayers_getplayer, [id])
        if (dbq_player.rowCount > 0)  {
            const teamid = dbq_player.rows[0]["teamid"];
            const dbq_team = await db.query(queryTeams_getteam, [teamid, user_id])
            if (dbq_team.rowCount > 0)  {
                const dbq_update = await db.query(queryPlayers_updateplayer, [name, id])
                if (dbq_update.rowCount > 0)  {
                    return res.status(200).json(dbq_update.rows[0]);
                }
            }
        }

        return res.status(403).json({message: "Rename Failed"});
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "Token Expired"});
        }
        return res.status(406).json({message: "Something went wrong here!"});
    }
}

const player_delete = async (req, res) => {
    // Queries
    const queryPlayers_deleteplayer = `DELETE FROM Players WHERE PlayerID = $1 `;
    const queryPlayers_getplayer = `SELECT * FROM Players WHERE PlayerID = $1`;
    const queryTeams_getteam = `SELECT * FROM Teams WHERE TeamID = $1 AND ManagerID = $2`;

    // Main
    const {token, id} = req.body;
    try {
        // Token Expiration set to 30 days, because reasons
        const decoded = jwt.verify(token, db.SECRET_KEY, {maxAge: "30d"});
        const user_id = decoded["id"];

        const dbq_player = await db.query(queryPlayers_getplayer, [id])
        if (dbq_player.rowCount > 0)  {
            const teamid = dbq_player.rows[0]["teamid"];
            const dbq_team = await db.query(queryTeams_getteam, [teamid, user_id])
            if (dbq_team.rowCount > 0)  {
                const dbq_delete = await db.query(queryPlayers_deleteplayer, [id])
                if (dbq_delete.rowCount > 0)  {
                    return res.status(200).json({message: "Successfully Deleted"});
                }
            }
        }

        return res.status(403).json({message: "Deletion Failed"});
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "Token Expired"});
        }
        return res.status(406).json({message: "Something went wrong here!"});
    }
}

const player_injured = async (req, res) => {
    // Queries
    const queryPlayers_setinjured = `UPDATE Players SET injured = $1 WHERE PlayerID = $2 RETURNING *`;
    const queryPlayers_getplayer = `SELECT * FROM Players WHERE PlayerID = $1`;
    const queryTeams_getteam = `SELECT * FROM Teams WHERE TeamID = $1 AND ManagerID = $2`;

    // Main
    const {token, id, injured} = req.body;
    try {
        // Token Expiration set to 30 days, because reasons
        const decoded = jwt.verify(token, db.SECRET_KEY, {maxAge: "30d"});
        const user_id = decoded["id"];

        const dbq_player = await db.query(queryPlayers_getplayer, [id])
        if (dbq_player.rowCount > 0)  {
            const teamid = dbq_player.rows[0]["teamid"];
            const dbq_team = await db.query(queryTeams_getteam, [teamid, user_id])
            if (dbq_team.rowCount > 0)  {
                const dbq_injured = await db.query(queryPlayers_setinjured, [injured, id])
                if (dbq_injured.rowCount > 0)  {
                    return res.status(200).json({message: "Successfully Updated"});
                }
            }
        }

        return res.status(403).json({message: "Update Failed"});
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "Token Expired"});
        }
        return res.status(406).json({message: "Something went wrong here!"});
    }
}


module.exports = { all_players, get_id, player_add, player_update, player_delete, player_injured };