'use strict';
const sql = require('mssql');

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
        return res.status(403).send({error: 'Wrong Server'});
    if (!validator.isEmail(email))
        return res.status(403).send({error: 'Email incorrect'});
    if (!validator.isAlphanumeric(username))
        return res.status(403).send({error: 'Nom d\'utilisateur incorrect'});
    if (!validator.equals(password, passwordConfirmation))
        return res.status(403).send({error: 'Les mots de passe ne correspondent pas'});
    if (password.length < 6 || password.length > 15)
        return res.status(403).send({error: 'Taille du mot de passe incorrecte'});

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
    try {
        const request = new sql.Request();

        request.input('username', sql.VarChar, username);
        request.input('hashedPassword', sql.VarChar, hashedPassword);
        request.input('email', sql.VarChar, email);
        request.input('ip', sql.VarChar, ip);
        await request.query(`${INSERT_USER_REQUEST} @username, @hashedPassword, @email, @ip)`);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({error: global.translate.ERROR_IN_DATABASE});
    }

    /* Done */
    return res.status(200).send({success: global.translate.REGISTER_SUCCESSFULL});
}

module.exports = register;
