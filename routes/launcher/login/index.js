'use strict';
const validator = require('validator');
const sql = require('mssql');
const jwt = require('jsonwebtoken');

const GET_ACCOUNT = 'SELECT TOP 1 [Name], [Password] FROM [dbo].[Account] WHERE [Name] = @username;';
const GET_BANS = 'SELECT TOP 1 [Value] FROM [dbo].[_GF_Launcher_Bans] WHERE [Value] = @ipaddress OR [Value] = @uuid OR [Value] = @computername;';
const ADD_LOG = "INSERT INTO [dbo].[_GF_Launcher_ConnectionLog] ([AccountName], [Server], [IpAddress], [UUID], [ComputerName]) VALUES (@account, @server, @ipaddress, @uuid, @computername)";

async function login(req, res)
{
    const server = global.config[req.body.server || 'NosWings'];
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
    try
    {
        await sql.connect(server.database);

        const request = new sql.Request();
        request.input('username', sql.VarChar, account.username);
        recordset = await request.query(GET_ACCOUNT);
        recordset = recordset.recordset || [];
        sql.close();
    }
    catch (error)
    {
        sql.close();
        console.log(error);
        return res.status(500).send(global.translate.ERROR_IN_DATABASE);
    }

    /* If yes, throw an error */
    if (recordset.length <= 0)
        return res.status(403).send(global.translate.COULD_NOT_FIND_USER);
    saved_pass = recordset[0].Password;

    /* Log */
    try
    {
        await sql.connect(server.database);

        const request = new sql.Request();
        request.input('account', sql.VarChar, account.username);
        request.input('server', sql.VarChar, server);
        request.input('ipaddress', sql.VarChar, account.ipaddress);
        request.input('uuid', sql.VarChar, account.uuid);
        request.input('computername', sql.VarChar, account.computername);
        recordset = await request.query(ADD_LOG);
        recordset = recordset.recordset || [];
        sql.close();
    }
    catch (error)
    {
        sql.close();
        console.log(error);
        return res.status(500).send(global.translate.ERROR_IN_DATABASE);
    }

    /* Check if banned */
    try
    {
        await sql.connect(server.database);

        const request = new sql.Request();
        request.input('ipaddress', sql.VarChar, account.ipaddress);
        request.input('uuid', sql.VarChar, account.uuid);
        request.input('computername', sql.VarChar, account.computername);
        recordset = await request.query(GET_BANS);
        recordset = recordset.recordset || [];
        sql.close();
    }
    catch (error)
    {
        sql.close();
        console.log(error);
        return res.status(500).send(global.translate.ERROR_IN_DATABASE);
    }

    /* If yes, throw an error */
    if (recordset.length > 0)
        return res.status(403).send(global.translate.BANNED);

    /* Check password */
    if (saved_pass === account.hashedPassword)
    {
        let token = jwt.sign(account, server.tokenSecret, { expiresIn: 10800 });
        return res.status(200).send({success: global.translate.AUTHENTICATED, token: token});
    }
    
    /* WRONG PASSWORD */
    return res.status(403).send(global.translate.NOT_AUTHENTICATED);
}

module.exports = login;
