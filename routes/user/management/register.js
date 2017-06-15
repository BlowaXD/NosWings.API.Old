const config = require("../../../config/secret.js");
const sql = require("mssql");
const REGISTER_REQUEST = "SELECT TOP 1 Name FROM [dbo].[Account] WHERE [Name] = '";
const INSERT_USER_REQUEST = "INSERT INTO dbo.Account (Authority, LastCompliment, LastSession, Name, Password, Email, RegistrationIp) VALUES (0, 0, 0, '";

module.exports = function (req, res) {
    let email = "" + req.body.email;
    let username = "" + req.body.username;
    let password = "" + req.body.password;
    let passwordConfirmation = "" + req.body.passwordConfirmation;
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (validator.isEmail(email) && validator.isAlphanumeric(username) && validator.equals(password, passwordConfirmation) && (password.length >= 6 && password.length <= 15)) {
        sql.connect(config.db).then(function () {
            new sql.Request()
                .query(`${REGISTER_REQUEST}${username}'`)
                .then(function (recordset) {
                    if (recordset.length === 0) {
                        let hashedPassword = require('crypto').createHash('sha512').update(password).digest('hex');
                        new sql.Request()
                            .query(`${INSERT_USER_REQUEST}${username}"', '${hashedPassword}', '${email}', '${ip}')`)
                            .then(function (recordset) {
                                return res.render("register.ejs", {
                                    success: global.translate.NICE_TRY_SQL_INJECTION
                                });
                            })
                            .catch(function (err) {
                                console.log(err);
                                return res.render("register.ejs", {
                                    error: global.translate.ERROR_IN_DATABASE
                                });
                            });
                    } else {
                        return res.render("register.ejs", {
                            error: global.translate.USER_ALREADY_EXIST
                        });
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    return res.render("register.ejs", {
                        error: global.translate.ERROR_IN_DATABASE
                    });
                });
        });
    } else {
        return res.render("register.ejs", {
            error: "Données entrées invalides"
        });
    }
};