'use strict';
const sql = require('mssql');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const GET_ACCOUNT = 'SELECT TOP 1 [Name], [Password] FROM [dbo].[Account] WHERE [Name] = @username;';
const GET_BANS = 'SELECT TOP 1 [Value] FROM [dbo].[_GF_Launcher_Bans] WHERE [Value] = @ipaddress OR [Value] = @uuid OR [Value] = @computername;';
const ADD_LOG = "INSERT INTO [dbo].[_GF_Launcher_ConnectionLog] ([AccountName], [Server], [IpAddress], [UUID], [ComputerName]) VALUES (@account, @server, @ipaddress, @uuid, @computername)";

async function login(req, res) {
    const server = global.config.servers[req.body.server || 'NosWings'];
    const account = {
        username: req.body.username,
        hashedPassword: req.body.hashedPassword,
        ipaddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        computername: req.body.hostname,
        uuid: req.body.uuid
    };
    let saved_pass;

    /* Some checks */
    if (!server)
        return res.status(403).send(global.translate.WRONG_SERVER);
    if (!account.hashedPassword || !validator.isAlphanumeric(account.hashedPassword))
        return res.status(403).send(global.translate.WRONG_PASSWORD);
    if (!account.username || !validator.isAlphanumeric(account.username))
        return res.status(403).send(global.translate.WRONG_USERNAME);
    if (!account.ipaddress || !account.computername || !account.uuid)
        return res.status(403).send("NOPE");

    /* Await the BD connection & check if username is already taken */
    let recordset;

    /* Check if banned */
    try {
        const request = await server.db.request()
            .input('ipaddress', sql.VarChar, account.ipaddress)
            .input('uuid', sql.VarChar, account.uuid)
            .input('computername', sql.VarChar, account.computername)
            .query(GET_BANS);
        recordset = request.recordset || [];
    }
    catch (error) {
        return res.status(500).send(global.translate.ERROR_IN_DATABASE);
    }

    /* If yes, throw an error */
    if (recordset.length > 0)
        return res.status(403).send(global.translate.BANNED);


    try {
        const request = await server.db.request()
            .input('username', sql.VarChar, account.username)
            .query(GET_ACCOUNT);
        recordset = request.recordset || [];
    }
    catch (error) {
        return res.status(500).send(global.translate.ERROR_IN_DATABASE);
    }

    /* If yes, throw an error */
    if (recordset.length <= 0)
        return res.status(403).send(global.translate.COULD_NOT_FIND_USER);

    saved_pass = recordset[0].Password;

    if (saved_pass !== account.hashedPassword) {
        /* WRONG PASSWORD */
        return res.status(403).send(global.translate.NOT_AUTHENTICATED);
    }

    /* Log */
    try {
        const request = await server.db.request()
            .input('account', sql.VarChar, account.username)
            .input('server', sql.VarChar, server)
            .input('ipaddress', sql.VarChar, account.ipaddress)
            .input('uuid', sql.VarChar, account.uuid)
            .input('computername', sql.VarChar, account.computername)
            .query(ADD_LOG);
        recordset = request.recordset || [];
    }
    catch (error) {
        return res.status(500).send(global.translate.ERROR_IN_DATABASE);
    }

    /* Check password */
    let token = jwt.sign(account, server.tokenSecret, {expiresIn: 10800});
    return res.status(200).send({success: global.translate.AUTHENTICATED, token: token});
}

module.exports = login;