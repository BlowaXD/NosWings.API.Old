'use strict';
const sql = require('mssql');

const GET_ACCOUNT = `
    SELECT [Permissions]
    FROM [_GF_CS_Accounts]
    LEFT JOIN Account
        ON [_GF_CS_Accounts].[AccountId] = [Account].[AccountId]
    WHERE [Account].[Name] = @username
        AND [Account].[Password] = @password`;

async function getPerm(req, res, next)
{
    const server = global.config.servers[req.user.server];
    const username = req.user.username;
    const hashedPassword = req.user.hashedPassword;

    /* Get infos */
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
    const permissions = recordset[0].Permissions || 0;

    req.user.permissions = {
        IS_ADMIN: (permissions & global.config.e_permissions.IS_ADMIN) === 1,
        IS_GM: (permissions & global.config.e_permissions.IS_GM >> 1) === 1
    };
    next();
}

module.exports = getPerm;