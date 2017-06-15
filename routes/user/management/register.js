'use strict';
const config = require('../../../config/secret.js');
const sql = require('mssql');

const REGISTER_REQUEST = 'SELECT TOP 1 Name FROM [dbo].[Account] WHERE [Name] = \'';
const INSERT_USER_REQUEST = 'INSERT INTO dbo.Account (Authority, LastCompliment, LastSession, Name, Password, Email, RegistrationIp) VALUES (0, 0, 0, \'';

async function register (req, res)
{
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const passwordConfirmation = req.body.passwordConfirmation;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    /* Some checks */
    if (!validator.isEmail(email))
        return res.render('register.ejs', { error: 'Email incorrect' });
    if (!validator.isAlphanumeric(username))
        return res.render('register.ejs', { error: 'Nom d\'utilisateur incorrect' });
    if (!validator.equals(password, passwordConfirmation))
        return res.render('register.ejs', { error: 'Les mots de passe ne correspondent pas' });
    if (password.length < 6 || password.length > 15)
        return res.render('register.ejs', { error: 'Taille du mot de passe incorrecte' });

    /* Await the BD connection & check if username is already taken */
    let recordset;
    try
    {
        await sql.connect(config.db);
        recordset = await new sql.Request().query(`${REGISTER_REQUEST}${username}'`);
    }
    catch (error)
    {
        console.log(error);
        return res.render('register.ejs', { error: global.translate.ERROR_IN_DATABASE });
    }

    /* If yes, throw an error */
    if (recordset.length !== 0)
        return res.render('register.ejs', { error: global.translate.USER_ALREADY_EXIST });

    /* Register account */
    let hashedPassword = require('crypto').createHash('sha512').update(password).digest('hex');
    try
    {
        await new sql.Request().query(`${INSERT_USER_REQUEST}${username}"', '${hashedPassword}', '${email}', '${ip}')`);
    }
    catch (error)
    {
        console.log(error);
        return res.render('register.ejs', { error: global.translate.ERROR_IN_DATABASE });
    }

    /* Done */
    return res.render('register.ejs', { success: global.translate.REGISTER_SUCCESSFULL });
}

module.exports = register;