'use strict';
const sql = require('mssql');
const jwt = require('jsonwebtoken');

const GET_ACCOUNT = "SELECT TOP 1 Name, password FROM [dbo].[Account] WHERE [Name] = '";

async function login(req, res) {
    const account = {
        username: req.body.username,
        email: req.body.email,
    };
    const server = global.config[req.body.server]

    /* Some checks */
    if (!server)
        return res.status(403).send({error: 'Wrong Server'});
    if (!validator.isAlphanumeric(username))
        return res.status(403).send({error: 'Email incorrect'});
    if (!validator.isEmail(username))
        return res.status(403).send({error: 'Nom d\'utilisateur incorrect'});

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
        return res.status(403).send({error: global.translate.USER_ALREADY_EXIST});

    if (recordset[0].email === account.email) {
        /*
        ** IMPLEMENT EMAIL SENDING THROUGH SMTP
         */
    }

    /* WRONG EMAIL */
    return res.status(403).send({error: 'Mot de passe eronné'})
}

module.exports = login;