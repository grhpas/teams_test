const db = require('../dbclient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otp = require('otplib');
const QRCode = require('qrcode');

const SECRET_KEY = '*&GUIKB%^&*(J';

const preregister = async (req, res) => {
    otp.totp.options = { digits: 6, step: 1, window: 30, epoch: Date.now(), };  // ~30 seconds
    const twofa = otp.totp.generate(SECRET_KEY);
    // return res.send(twofa)
    const bufferImage = await QRCode.toDataURL(twofa, {margin : 7, width : 175});
    return res.send(bufferImage);  // QRCode.toFile('/static', twofa));
}


const register = async (req, res) => {
    // Queries
    const queryUsers_getbyemail = `SELECT * FROM Users WHERE email = $1`;
    const queryUsers_create = `INSERT INTO Users (email, password, active) VALUES ($1, $2, TRUE) RETURNING *`;

    const {email, password, twofa} = req.body;
    try {
        // Check 2FA, early fail to prevent checking existence of emails
        otp.totp.options = { digits: 6, step: 1, window: 30, epoch: Date.now(), };  // ~30 seconds
        const twofa_valid = otp.totp.check(twofa, SECRET_KEY);
        if (!twofa_valid) {
            return res.status(401).json({message: "2FA Failure"});
        }

        // Check if user exists (email)
        const db_res = await db.query(queryUsers_getbyemail, [email, ]);
        if (db_res.rowCount > 0) {
            return res.status(400).json({message: "Already Registered"});
        }

        const salt = await db.getSalt();
        const hashed_password = await bcrypt.hashSync(password, salt);

        const db_create = await db.query(queryUsers_create, [email, hashed_password]);
        const token = jwt.sign({email: email, id: db_create.rows[0]["userid"]}, db.SECRET_KEY);
        return res.status(201).json({token: token});
    } catch (err) {
        return res.status(406).json({message: "Something went wrong here!"});
    }
}

const login = async (req, res) => {
    const queryUsers_getbypassword = `SELECT * FROM Users WHERE email = $1`;

    const {email, password, twofa} = req.body;
    try {
        // Check 2FA, early fail
        otp.totp.options = { digits: 6, step: 1, window: 30, epoch: Date.now(), };  // ~30 seconds
        const twofa_valid = otp.totp.check(twofa, SECRET_KEY);
        if (!twofa_valid) {
            return res.status(401).json({message: "2FA Failure"});
        }

        // Check if user exists (email), and fail accordingly
        const db_res = await db.query(queryUsers_getbypassword, [email, ]);
        if (db_res.rowCount <= 0) {
            // Depending on security measures we could allow "User does not exist" message
            // return res.status(400).json({message: "User does not exist"});
            return res.status(401).json({message: "Wrong Credentials"})
        }

        // Check against stored hash
        const stored_password_match = await bcrypt.compare(password, db_res.rows[0]["password"])
        if (!stored_password_match) {
            return res.status(401).json({message: "Wrong Credentials"})
        }

        const token = jwt.sign({email: email, id: db_res.rows[0]["userid"]}, db.SECRET_KEY);
        return res.status(202).json({token: token});
    } catch (err) {
        return res.status(406).json({message: "Something went wrong here!"});
    }
}


module.exports = { preregister, register, login };