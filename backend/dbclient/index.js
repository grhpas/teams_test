const { Pool, Client } = require('pg')
var bcrypt = require('bcryptjs');
const SECRET_KEY = '@$#SEYH*U';

let VERBOSE = false;

/* MAIN DB CREDENTIALS
   These shouldn't be here but for testing purposes
   Using simple client since connection pool is irrelevant to tests */

if (VERBOSE) {
    console.log('CONNECTING TO DB');
}

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'carolos',
    password: 'grhpas',
    port: 5432,
})
client.connect()

/* INITIALIZING TABLES
   Boring stuff here, to ensure this is running smoothly */

if (VERBOSE) {
    console.log('INITIALIZING TABLES')
}

const createSettings = `CREATE TABLE IF NOT EXISTS Settings (
    name varchar(30) NOT NULL,
    payload varchar(150)
);`

const createUsers = `CREATE TABLE IF NOT EXISTS Users (
    UserID serial PRIMARY KEY,
    email varchar(50) NOT NULL,
    password varchar(128) NOT NULL,
    active BOOLEAN,
    PRIMARY KEY (UserID)
);`

const createTeams = `CREATE TABLE IF NOT EXISTS Teams (
    TeamID serial PRIMARY KEY,
    ManagerID INT NOT NULL,
    name varchar(30) NOT NULL,
    active BOOLEAN,
    FOREIGN KEY (ManagerID)
      REFERENCES Users (UserID)
);`

const createPlayers = `CREATE TABLE IF NOT EXISTS Players (
    PlayerID serial PRIMARY KEY,
    TeamID INT NOT NULL,
    name varchar(30) NOT NULL,
    injured BOOLEAN,
    active BOOLEAN,
    FOREIGN KEY (TeamID)
      REFERENCES Teams (TeamID)
      ON DELETE CASCADE
);`

// client.query('SELECT NOW()', (err, res) => {
//     console.log(err, res)
//     // client.end()
// })

client.query(createSettings, (err, res) => {
    if (VERBOSE) {
        console.log(err, res)
    }
})

client.query(createUsers, (err, res) => {
    if (VERBOSE) {
        console.log(err, res)
    }
})

client.query(createTeams, (err, res) => {
    if (VERBOSE) {
        console.log(err, res)
    }
})

client.query(createPlayers, (err, res) => {
    if (VERBOSE) {
        console.log(err, res)
    }
})

/* CHECK SALT AND CREATE IT IF IT DOESN'T EXIST */
async function getSalt() {
    const querySettings_getsalt = `SELECT payload FROM Settings WHERE name = 'salt'`;
    const querySettings_setsalt = `INSERT INTO Settings (name, payload) VALUES ($1, $2) RETURNING *`;

    let salt;
    try {
        const res = await client.query(querySettings_getsalt);

        if (res.rowCount > 0) {
            salt = res.rows[0]["payload"];
        } else {
            salt = bcrypt.genSaltSync(10);
            try {
                const res2 = await client.query(querySettings_setsalt, ["salt", salt]);
                if (VERBOSE) {
                    console.log(res2.rows[0]);
                }
            } catch (err) {
                if (VERBOSE) {
                    console.log(err.stack);
                }
            }
        }

    } catch (err) {
        if (VERBOSE) {
            console.log(err.stack);
        }
    }

    return Promise.resolve(salt);
}

module.exports = {
    query: (text, params, callback) => {
        return client.query(text, params, callback)
    },
    getSalt,
    SECRET_KEY,
}