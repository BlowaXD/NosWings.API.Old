'use strict';
const validator = require('validator');
const sql = require("mssql");
const nodemailer = require("nodemailer");

const GET_ACCOUNT = "SELECT TOP 1 Name, password FROM [dbo].[Account] WHERE [Name] = '";

async function login(req, res) {
    const account = {
        username: req.body.username,
        email: req.body.email,
    };
    const server = global.config[req.body.server];

    /* Some checks */
    if (!server)
        return res.status(403).send({error: global.translate.WRONG_SERVER});
    if (!validator.isAlphanumeric(username))
        return res.status(403).send({error: global.translate.WRONG_USERNAME});
    if (!validator.isEmail(email))
        return res.status(403).send({error: global.translate.WRONG_EMAIL});

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
        return res.status(403).send({error: global.translate.USER_DOES_NOT_EXIST});

    if (recordset[0].email !== account.email) {
        return res.status(403).send({error: global.translate.WRONG_PASSWORD})
    }
    let transport = nodemailer.createTransport(server.email_config);

    /* WRONG EMAIL */
}

module.exports = login;
