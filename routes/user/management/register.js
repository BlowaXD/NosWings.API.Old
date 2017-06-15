'use strict';
import nodemailer from "nodemailer";
import sql from "mssql";

const REGISTER_REQUEST = 'SELECT TOP 1 Name FROM [dbo].[Account] WHERE [Name] =';
const INSERT_USER_REQUEST = 'INSERT INTO dbo.Account (Authority, LastCompliment, LastSession, Name, Password, Email, RegistrationIp) VALUES (0, 0, 0,';

async function register(req, res) {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const passwordConfirmation = req.body.passwordConfirmation;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const server = global.config[req.body.server];

    /* Some checks */
    if (!server)
        return res.status(403).send({error: global.translate.WRONG_SERVER});
    if (!validator.isEmail(email))
        return res.status(403).send({error: global.translate.WRONG_EMAIL});
    if (!validator.isAlphanumeric(username))
        return res.status(403).send({error: global.translate.WRONG_USERNAME_NOT_ALPHA});
    if (!validator.equals(password, passwordConfirmation))
        return res.status(403).send({error: global.translate.WRONG_PASSWORD_CONFIRMATION});
    if (password.length < 6 || password.length > 15)
        return res.status(403).send({error: global.translate.WRONG_PASSWORD_LENGTH});

    /* Await the BD connection & check if username is already taken */
    let recordset;
    try {
        await sql.connect(server.db);

        const request = new sql.Request();
        request.input('username', sql.VarChar, username);
        recordset = await request.query(`${REGISTER_REQUEST} @username`);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({error: global.translate.ERROR_IN_DATABASE});
    }

    /* If yes, throw an error */
    if (recordset.length !== 0)
        return res.status(403).send({error: global.translate.USER_ALREADY_EXIST});

    /* Register account */
    let hashedPassword = require('crypto').createHash('sha512').update(password).digest('hex');
    let verificationToken = crypto.randomBytes(16).toString('hex');
    try {
        const request = new sql.Request();

        request.input('username', sql.VarChar, username);
        request.input('hashedPassword', sql.VarChar, hashedPassword);
        request.input('email', sql.VarChar, email);
        request.input('ip', sql.VarChar, ip);
        request.input('veriftoken', sql.VarChar, verificationToken);
        await request.query(`${INSERT_USER_REQUEST} @username, @hashedPassword, @email, @ip, @veriftoken)`);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({error: global.translate.ERROR_IN_DATABASE});
    }

    /*
    ** SEND MAIL TO CONFIRM
     */
    let transport = nodemailer.createTransport(server.email_config);

    let mailOptions = {
        from: {server} + '<' + server.email + '>', // sender address
        to: email, // list of receivers
        subject: global.translate.REGISTRATION_EMAIL_SUBJECT, // Subject line
        text: global.translate.REGISTRATION_EMAIL_TEXT + 'http://example.com/validationRoute/'/* ADD VALIDATION ROUTE DEPENDS ON SERVER */,
        html: global.translate.REGISTRATION_EMAIL_HTML + '<a href="http://example.com/validationRoute/"></a>' /* ADD VALIDATION ROUTE DEPENDS ON SERVER */
    };
    mailOptions.text += verificationToken + global.translate.REGISTRATION_EMAIL_TEXT_REGARDS;
    mailOptions.html += verificationToken + global.translate.REGISTRATION_EMAIL_HTML_REGARDS;

    recordset = await transporter.sendMail(mailOptions);
    if (recordset) {
        return res.status(500).send({error: global.translate.REGISTRATION_EMAIL_ERROR});
    }
    /* REGISTRATION DONE SUCCESSFULLY */
    return res.status(200).send({success: global.translate.REGISTER_SUCCESSFULL});
}

module.exports = register;
