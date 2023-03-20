const db = require('../dbclient');
const jwt = require('jsonwebtoken');


const all_teams = async (req, res) => {
    // Queries
    const queryTeams_getbyuser = `SELECT * FROM Teams WHERE ManagerID = $1`;

    // Main
    const {token} = req.body;
    try {
        // Token Expiration set to 30 days, because reasons
        const decoded = jwt.verify(token, db.SECRET_KEY, {maxAge: "30d"});
        const user_id = decoded["id"];

        const db_query = await db.query(queryTeams_getbyuser, [user_id])
        return res.status(200).json({teams: db_query.rows});
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "Token Expired"});
        }
        return res.status(406).json({message: "Something went wrong here!"});
    }
}

const get_id = async (req, res) => {
    // Queries
    const queryTeams_getteam = `SELECT * FROM Teams WHERE TeamID = $1 AND ManagerID = $2`;

    // Main
    const {token, id} = req.body;
    try {
        // Token Expiration set to 30 days, because reasons
        const decoded = jwt.verify(token, db.SECRET_KEY, {maxAge: "30d"});
        const user_id = decoded["id"];

        const db_query = await db.query(queryTeams_getteam, [id, user_id])
        if (db_query.rowCount > 0)  {
            return res.status(200).json(db_query.rows[0]);
        }

        return res.status(403).json({message: "No Team (that you can access) with that ID"});
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "Token Expired"});
        }
        return res.status(406).json({message: "Something went wrong here!"});
    }
}

const team_add = async (req, res) => {
    // Queries
    const queryTeams_addteam = `INSERT INTO Teams (ManagerID, name, active) VALUES ($1, $2, True) RETURNING *`;

    // Main
    const {token, name} = req.body;
    try {
        // Token Expiration set to 30 days, because reasons
        const decoded = jwt.verify(token, db.SECRET_KEY, {maxAge: "30d"});
        const user_id = decoded["id"];

        const db_query = await db.query(queryTeams_addteam, [user_id, name])
        if (db_query.rowCount > 0)  {
            return res.status(200).json(db_query.rows[0]);
        }
        return res.status(403).json({message: "Creation Failed"});
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "Token Expired"});
        }
        return res.status(406).json({message: "Something went wrong here!"});
    }
}

const team_update = async (req, res) => {
    // Queries
    const queryTeams_updateteam = `UPDATE Teams SET name = $1 WHERE ManagerID = $2 AND TeamID = $3 RETURNING *`;

    // Main
    const {token, name, id} = req.body;
    try {
        // Token Expiration set to 30 days, because reasons
        const decoded = jwt.verify(token, db.SECRET_KEY, {maxAge: "30d"});
        const user_id = decoded["id"];

        const db_query = await db.query(queryTeams_updateteam, [name, user_id, id])
        if (db_query.rowCount > 0)  {
            return res.status(200).json(db_query.rows[0]);
        }
        return res.status(403).json({message: "Rename Failed"});
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "Token Expired"});
        }
        return res.status(406).json({message: "Something went wrong here!"});
    }
}

const team_delete = async (req, res) => {
    // Queries
    const queryTeams_deleteteam = `DELETE FROM Teams WHERE ManagerID = $1 AND TeamID = $2`;

    // Main
    const {token, id} = req.body;
    try {
        // Token Expiration set to 30 days, because reasons
        const decoded = jwt.verify(token, db.SECRET_KEY, {maxAge: "30d"});
        const user_id = decoded["id"];

        const db_query = await db.query(queryTeams_deleteteam, [user_id, id])
        if (db_query.rowCount > 0)  {
            return res.status(200).json({message: "Successfully Deleted"});
        }
        return res.status(403).json({message: "Deletion Failed"});
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "Token Expired"});
        }
        return res.status(406).json({message: "Something went wrong here!", err: err.stack});
    }
}

module.exports = { all_teams, get_id, team_add, team_update, team_delete };