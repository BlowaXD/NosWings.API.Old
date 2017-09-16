'use strict';
const validator = require('validator');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const sql = require("mssql");
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
        return res.status(200).send({success: false, error: global.translate.WRONG_USERNAME});
    if (!validator.isAlphanumeric(account.username))
        return res.status(200).send({success: false, error: global.translate.WRONG_USERNAME});
    if (!validator.equals(account.password, account.passwordConfirmation))
        return res.status(200).send({success: false, error: global.translate.WRONG_USERNAME});
    if (account.password.length < 6 || account.password.length > 25)
        return res.status(200).send({success: false, error: global.translate.WRONG_USERNAME});

    /* Await the BD connection & check if username is already taken */
    let recordset;
    try {
        const request = await server.db.request()
            .input('username', sql.VarChar, account.username)
            .query(REGISTER_REQUEST);
        recordset = request.recordset || [];
    }
    catch (error) {
        return res.status(200).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }

    recordset = recordset.recordset;
    /* If yes, throw an error */
    if (recordset.length !== 0) {
        return res.status(200).send({success: false, error: global.translate.USER_ALREADY_EXIST});
    }

    /* Register account */
    let hashedPassword = require('crypto').createHash('sha512').update(account.password).digest('hex');
    let verificationToken = crypto.randomBytes(16).toString('hex');
    try {
        const request = await server.db.request()
            .input('username', sql.VarChar, account.username)
            .input('password', sql.VarChar, account.hashedPassword)
            .input('email', sql.VarChar, account.email)
            .input('registrationIp', sql.VarChar, account.ip)
            .input('veriftoken', sql.VarChar, verificationToken)
            .query(INSERT_USER_REQUEST);

        recordset = request.recordset || [];
    }
    catch (error) {
        return res.status(200).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }

    /* SEND MAIL TO CONFIRM */
    let transporter = nodemailer.createTransport(server.email_config);
    let mailOptions = {
        from: "Inscription NosWings" + '<' + server.email_config.auth.user + '>', // sender address
        to: account.email, // list of receivers
        subject: "Inscription NosWings : Reborn", // Subject line
        html: '' + fs.readFileSync("./mails/mail.html", 'utf8')
    };

    mailOptions.html = mailOptions.html.replaceAll("{LOGO}", config.urls.logo);
    mailOptions.html = mailOptions.html.replaceAll("{SERVER}", req.body.server);
    mailOptions.html = mailOptions.html.replaceAll("{USER}", account.username);
    mailOptions.html = mailOptions.html.replaceAll("{EMAIL}", account.email);
    mailOptions.html = mailOptions.html.replaceAll("{BUTTON_TITLE}", "Valider mon compte");
    mailOptions.html = mailOptions.html.replaceAll("{BUTTON_LINK}", "https://noswings.fr/register/validate/" + verificationToken);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).send({success: false, error: global.translate.REGISTRATION_ERROR_MAIL});
        }
        /* REGISTRATION DONE SUCCESSFULLY */
        return res.status(200).send({success: true, data: global.translate.REGISTRATION_SUCCESS});
    });
}

module.exports = register;