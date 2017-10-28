'use strict';
const validator = require('validator');
const crypto = require('crypto');
const sql = require("mssql");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fs = require('fs');
const REGISTER_REQUEST = 'SELECT TOP 1 Name FROM [dbo].[Account] WHERE [Name] = @username;';
const INSERT_USER_REQUEST = 'INSERT INTO dbo.Account (Authority, Name, Password, Email, RegistrationIp, VerificationToken) VALUES (-1, @username, @password, @email, @registrationIp, @veriftoken);';

String.prototype.replaceAll = function (search, replacement) {
    const target = this;
    return target.split(search).join(replacement);
};

async function register(req, res) {
    const server = global.config.servers[req.body.server];
    const account = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation,
        ip: req.body.ip,
    };

    if (!account.email || !account.username || !account.password || !account.ip) {
        return res.status(403).send({error: global.translate.WRONG_USERNAME});
    }

    /* Some checks */
    if (!validator.isEmail(account.email))
        return res.status(403).send({success: false, error: global.translate.WRONG_EMAIL});
    if (!validator.isAlphanumeric(account.username))
        return res.status(403).send({success: false, error: global.translate.WRONG_USERNAME});
    if (!validator.equals(account.password, account.passwordConfirmation))
        return res.status(403).send({success: false, error: global.translate.WRONG_PASSWORD});
    if (account.password.length < 6 || account.password.length > 25)
        return res.status(403).send({success: false, error: global.translate.WRONG_PASSWORD});

    /* Await the BD connection & check if username is already taken */
    let recordset;
    try {
        const request = await server.db.request()
            .input('username', sql.VarChar, account.username)
            .query(REGISTER_REQUEST);
        recordset = request.recordset || [];
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }
    /* If yes, throw an error */
    if (recordset.length !== 0) {
        return res.status(500).send({success: false, error: global.translate.USER_ALREADY_EXIST});
    }

    /* Register account */
    let hashedPassword = require('crypto').createHash('sha512').update(account.password).digest('hex');
    let verificationToken = crypto.randomBytes(16).toString('hex');
    try {
        const request = await server.db.request()
            .input('username', sql.VarChar, account.username)
            .input('password', sql.VarChar, hashedPassword)
            .input('email', sql.VarChar, account.email)
            .input('registrationIp', sql.VarChar, account.ip)
            .input('veriftoken', sql.VarChar, verificationToken)
            .query(INSERT_USER_REQUEST);

        recordset = request.recordset || [];
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }


    let html = '' + fs.readFileSync("./mails/mail-template.html", 'utf8');

    html = html.replaceAll("{LOGO}", "https://noswings/assets/img/logo.png");
    html = html.replaceAll("{USER}", account.username);
    html = html.replaceAll("{BUTTON_TITLE}", "VALIDATE ACCOUNT");
    html = html.replaceAll("{BUTTON_LINK}", "https://noswings.fr/register/validate/" + verificationToken);

    const msg = {
        to: account.email,
        from: 'NosWings \<register@mail.noswings.fr\>',
        subject: 'NosWings - Register',
        text: 'We are happy that you joined our community, here is the link to validate your account : https://noswings.fr/register/validate/' + verificationToken,
        html: html,
    };
    sgMail.send(msg);
    return res.status(200).send({success: true, data: global.translate.REGISTRATION_SUCCESS});
}

module.exports = register;
