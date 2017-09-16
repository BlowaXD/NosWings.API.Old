'use strict';
const validator = require('validator');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const sql = require("mssql");
const fs = require('fs');
const REGISTER_REQUEST = 'SELECT TOP 1 Name FROM [dbo].[Account] WHERE [Name] = @username;';
const INSERT_USER_REQUEST = 'INSERT INTO dbo.Account (Authority, Name, Password, Email, RegistrationIp, VerificationToken) VALUES (-1, @username, @password, @email, @registrationIp, @veriftoken);';

String.prototype.replaceAll = function(search, replacement) {
    const target = this;
    return target.split(search).join(replacement);
};

async function register(req, res) {
    try {
        await recaptcha.validateRequest(req);
    }
    catch (error)
    {
        return res.render('register', {
            error: "Recaptcha fail"
        });
    }
    
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const passwordConfirmation = req.body.passwordConfirmation;
    const ip = req.body.email;

    /* Some checks */
    if (!validator.isEmail(email))
        return res.status(403).send({error: global.translate.WRONG_USERNAMEG});
    if (!validator.isAlphanumeric(username))
        return res.status(403).send({error: global.translate.WRONG_USERNAMEG});
    if (!validator.equals(password, passwordConfirmation))
        return res.status(403).send({error: global.translate.WRONG_USERNAMEG});
    if (password.length < 6 || password.length > 25)
        return res.status(403).send({error: global.translate.WRONG_USERNAMEG});

    /* Await the BD connection & check if username is already taken */
    let recordset;
    try {
        await sql.connect(config.db);

        const request = new sql.Request();
        request.input('username', sql.VarChar, username);
        recordset = await request.query(`${REGISTER_REQUEST}`);
    }
    catch (error) {
        return res.status(500).send({error: global.translate.ERROR_IN_DATABASE});
    }

    recordset = recordset.recordset;
    /* If yes, throw an error */
    if (recordset.length !== 0)
        return res.status(403).send({error: global.translate.USER_ALREADY_EXIST});

    /* Register account */
    let verificationToken = crypto.randomBytes(16).toString('hex');
    try {
        const request = new sql.Request();

        request.input('username', sql.VarChar, username);
        request.input('password', sql.VarChar, hashedPassword);
        request.input('email', sql.VarChar, email);
        request.input('registrationIp', sql.VarChar, ip);
        request.input('veriftoken', sql.VarChar, verificationToken);
        await request.query(`${INSERT_USER_REQUEST}`);
    }
    catch (error) {
        return res.status(500).send({error: global.translate.ERROR_IN_DATABASE});
    }

    /* SEND MAIL TO CONFIRM */
    let transporter = nodemailer.createTransport(config.smtp);
    let mailOptions = {
        from: global.translate.REGISTRATION_EMAIL_SENDER + '<' + config.smtp.auth.user + '>', // sender address
        to: email, // list of receivers
        subject: global.translate.REGISTRATION_EMAIL_SUBJECT, // Subject line
        html: ''+fs.readFileSync("./mails/mail.html", 'utf8')
    };

    mailOptions.html = mailOptions.html.replaceAll("{LOGO}", config.urls.logo);
    console.error(config.urls.logo);
    mailOptions.html = mailOptions.html.replaceAll("{SERVER}", config.server);
    mailOptions.html = mailOptions.html.replaceAll("{GREETINGS}", global.translate.REGISTRATION_GREETINGS);
    mailOptions.html = mailOptions.html.replaceAll("{USER}", username);
    mailOptions.html = mailOptions.html.replaceAll("{EMAIL}", email);
    mailOptions.html = mailOptions.html.replaceAll("{MESSAGE}", global.translate.REGISTRATION_MESSAGE);
    mailOptions.html = mailOptions.html.replaceAll("{BUTTON_DESCRIPTION}", global.translate.REGISTRATION_BUTTON_DESCRIPTION);
    mailOptions.html = mailOptions.html.replaceAll("{BUTTON_TITLE}", global.translate.REGISTRATION_BUTTON_TITLE);
    mailOptions.html = mailOptions.html.replaceAll("{BUTTON_LINK}", config.urls.validate + verificationToken);
    mailOptions.html = mailOptions.html.replaceAll("{FOOTER_DESCRIPTION}", global.translate.REGISTRATION_FOOTER_DESCRIPTION);
    mailOptions.html = mailOptions.html.replaceAll("{FOOTER_STAFF_NAME}", global.translate.STAFF_NAME);
    mailOptions.html = mailOptions.html.replaceAll("{FORUM_LINK}", config.urls.forum);
    mailOptions.html = mailOptions.html.replaceAll("{DISCORD_LINK}", config.urls.discord);
    mailOptions.html = mailOptions.html.replaceAll("{SITE_LINK}", config.urls.site);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).send({error: global.translate.REGISTRATION_EMAIL_ERROR});
        }
        /* REGISTRATION DONE SUCCESSFULLY */
        return res.status(200).send({success: global.translate.REGISTER_SUCCESSFULL});
    });
}

module.exports = register;