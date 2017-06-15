'use strict';
const sql = require('mssql');
const jwt = require('jsonwebtoken');

const GET_ACCOUNT = "SELECT TOP 1 Name, password FROM [dbo].[Account] WHERE [Name] = '";

async function login(req, res) {
    const account = {
        username: req.body.username,
        hashedPassword: req.body.hashedPassword,
    };
    const server = global.config[req.body.server];

    /* Some checks */
    if (!server)
        return res.status(403).send({error: global.translate.WRONG_SERVER});
    if (!validator.isAlphanumeric(hashedPassword))
        return res.status(403).send({error: global.translate.WRONG_PASSWORD});
    if (!validator.isAlphanumeric(username))
        return res.status(403).send({error: global.translate.WRONG_USERNAME});

    /* Await the BD connection & check if username is already taken */
    let recordset;
    try {
        await sql.connect(server.db);

        const request = new sql.Request();
        request.input('username', sql.VarChar, username);
        recordset = await request.query(`${GET_ACCOUNT} @username`);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({error: global.translate.ERROR_IN_DATABASE});
    }

    /* If yes, throw an error */
    if (recordset.length === 0)
        return res.status(403).send({error: global.translate.COULD_NOT_FIND_USER});

    if (recordset[0].password === account.hashedPassword) {
        /* AUTH USER FOR 1 HOUR */
        let token = jwt.sign(account, server.tokenSecret, {expiresIn: 3600});
        return res.status(200).send({success: global.translate.AUTHENTICATED, token: token});
    }
    /* WRONG PASSWORD */
    return res.status(403).send({error: global.translate.AUTHENTICATED})
}

module.exports = login;