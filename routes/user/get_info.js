'use strict';
const sql = require('mssql');
const jwt = require('jsonwebtoken');

const GET_ACCOUNT = `
    SELECT [Permissions], [Money], [Character].[Name], [Character].Class,
        [Character].[Level], [Character].JobLevel, [Character].Gold
    FROM [Account]
    LEFT JOIN _GF_CS_Accounts
        ON [_GF_CS_Accounts].[AccountId] = [Account].[AccountId]
    LEFT JOIN Character
        ON [Character].[AccountId] = [Account].[AccountId]
    WHERE [Account].[Name] = @username
        AND [Account].[Password] = @password`;

async function login(req, res)
{
    const server = global.config.servers[req.user.server];
    const username = req.user.username;
    const hashedPassword = req.user.hashedPassword;

    /* Some checks */
    if (!server)
        return res.status(403).send({ success: false, error: global.translate.WRONG_SERVER });
    if (!username)
        return res.status(403).send({ success: false, error: global.translate.WRONG_USERNAME });
    if (!hashedPassword)
        return res.status(403).send({ success: false, error: global.translate.WRONG_PASSWORD });

    /* Await the BD connection & check if account exists */
    let recordset;
    try
    {
        const request = await server.db.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, hashedPassword)
            .query(GET_ACCOUNT);
        recordset = request.recordset || [];
    }
    catch (error)
    {
        console.log(error);
        return res.status(500).send({ success: false, error: global.translate.ERROR_IN_DATABASE });
    }

    /* If not, throw an error */
    if (recordset.length <= 0)
        return res.status(403).send({ success: false, error: global.translate.COULD_NOT_FIND_USER });

    /* Return infos */
    return res.send({
        success: true,
        data: {
            permissions: recordset[0].Permissions || null,
            money: recordset[0].Money || null,
            characters: recordset.map(t => new Object({
                name: t.Name,
                class: t.Class,
                level: t.Level,
                job_level: t.JobLevel,
                gold: t.Gold
            }))
        }
    });
}

module.exports = login;
