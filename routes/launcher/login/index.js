'use strict';
const validator = require('validator');
const sql = require('mssql');
const jwt = require('jsonwebtoken');

const GET_ACCOUNT = 'SELECT TOP 1 [Name], [Password] FROM [dbo].[Account] WHERE [Name] =';

async function login(req, res)
{
    const server = global.config[req.body.server || 'NosWings'];
    const account = {
        username: req.body.username,
        hashedPassword: req.body.hashedPassword,
    };

    /* Some checks */
    if (!server)
        return res.status(403).send(global.translate.WRONG_SERVER);
    if (!account.hashedPassword || !validator.isAlphanumeric(account.hashedPassword))
        return res.status(403).send(global.translate.WRONG_PASSWORD);
    if (!account.username || !validator.isAlphanumeric(account.username))
        return res.status(403).send(global.translate.WRONG_USERNAME);

    /* Await the BD connection & check if username is already taken */
    let recordset;
    try
    {
        await sql.connect(server.database);

        const request = new sql.Request();
        request.input('username', sql.VarChar, account.username);
        recordset = await request.query(`${GET_ACCOUNT} @username`);
        recordset = recordset.recordset || [];
        sql.close();
    }
    catch (error)
    {
        console.log(error);
        return res.status(500).send(global.translate.ERROR_IN_DATABASE);
    }

    /* If yes, throw an error */
    if (recordset.length <= 0)
        return res.status(403).send(global.translate.COULD_NOT_FIND_USER);

    if (recordset[0].Password === account.hashedPassword)
    {
        let token = jwt.sign(account, server.tokenSecret, { expiresIn: 10800 });
        return res.status(200).send({success: global.translate.AUTHENTICATED, token: token});
    }
    /* WRONG PASSWORD */
    return res.status(403).send(global.translate.NOT_AUTHENTICATED);
}

module.exports = login;
