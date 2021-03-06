'use strict';
const validator = require('validator');
const sql = require('mssql');
const jwt = require('jsonwebtoken');

const GET_ACCOUNT = `
    SELECT TOP 1 [AccountId]
    FROM [dbo].[Account]
    WHERE [Name] = @username
        AND [Password] = @password`;

async function login(req, res)
{
    const server = global.config.servers[req.query.server];
    const account = {
        server: req.query.server,
        username: req.query.username,
        hashedPassword: req.query.hashedPassword,
    };

    /* Some checks */
    if (!server)
        return res.status(403).send({ success: false, error: global.translate.WRONG_SERVER });
    if (!account.username || !validator.isAlphanumeric(account.username))
        return res.status(403).send({ success: false, error: global.translate.WRONG_USERNAME });
    if (!account.hashedPassword || !validator.isAlphanumeric(account.hashedPassword))
        return res.status(403).send({ success: false, error: global.translate.WRONG_PASSWORD });

    /* Await the BD connection & check if account exists */
    let recordset;
    try
    {
        const request = await server.db.request()
            .input('username', sql.VarChar, account.username)
            .input('password', sql.VarChar, account.hashedPassword)
            .query(GET_ACCOUNT);
        recordset = request.recordset || [];
    }
    catch (error)
    {
        console.log(error);
        return res.status(500).send({ success: false, error: global.translate.ERROR_IN_DATABASE });
    }

    /* If not, throw an error */
    if (recordset.length <= 0)
        return res.status(403).send({ success: false, error: global.translate.COULD_NOT_FIND_USER });

    /* AUTH USER FOR 2 HOUR */
    const data = jwt.sign(account, server.tokenSecret, { expiresIn: 7200 });
    return res.send({ success: true, data });
}

module.exports = login;
