'use strict';
const sql = require('mssql');
const GET_ACCOUNT = `
    SELECT TOP 1 [Permissions], [Money]
    FROM [dbo].[Account]
    LEFT JOIN _GF_CS_Accounts
        ON [_GF_CS_Accounts].[AccountId] = [Account].[AccountId]
    WHERE [Name] = @username
        AND [Password] = @password`;
const GET_PACK_BY_ID = `Jekonépalakouéri désolé`;

async function get(req, res)
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

    /* Get account */
    let account;
    let pack;
    try
    {
        const request = await server.db.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, hashedPassword)
            .query(GET_ACCOUNT);
        account = request.recordset || [];

        const request_pack = await server.db.request()
            .input('packid', sql.Int, packid)
            .query(GET_PACK_BY_ID);
        pack = request.recordset || [];
    }
    catch (error)
    {
        console.log(error);
        return res.status(500).send({ success: false, error: global.translate.ERROR_IN_DATABASE });
    }

    if (account.Money < pack.Price)
    {
        return res.status(403).send({success: false, error: global.translate.NOT_ENOUGH_MONEY});
    }

    if (pack.Type === 1)
    {
        // DO RANDOM PICK A PACKITEM ID
    }
    else
    {
        // SEND EVERY PACK ITEM ID
    }

    /* INSERT THE MAIL AND REMOVE ACCOUNT MONEY */

    res.sendStatus(200);
}

module.exports = get;
