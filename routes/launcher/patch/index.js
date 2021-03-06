/**
 ________                     ___________.__       .__       .___
 /  _____/_____    _____   ____\_   _____/|__| ____ |  |    __| _/
 /   \  ___\__  \  /     \_/ __ \|    __)  |  |/ __ \|  |   / __ |
 \    \_\  \/ __ \|  Y Y  \  ___/|     \   |  \  ___/|  |__/ /_/ |
 \______  (____  /__|_|  /\___  >___  /   |__|\___  >____/\____ |
 \/     \/      \/     \/    \/            \/           \/

 */
'use strict';
const sql = require('mssql');
const config = require('../../../Config/config');

const QUERY_GET_PATCHS = `
    SELECT [Offset], [Value]
    FROM _GF_Launcher_PatchValues
    JOIN _GF_Launcher_Patchs
        ON _GF_Launcher_PatchValues.HashId = _GF_Launcher_Patchs.Id
    WHERE Hash = @hash`;

async function getPatch(req, res)
{
    const hash = req.body.hash;
    const server = global.config.servers[req.body.server || 'NosWings'];
    let recordset;

    /* Some checks */
    if (!server)
        return res.status(403).send(global.translate.WRONG_SERVER);
    if (!hash)
        return res.status(403).send(global.translate.WRONG_HASH);

    /* Await the BD connection & check if username is already taken */
    try
    {
        const request = await server.db.request()
            .input('hash', sql.VarChar, hash)
            .query(QUERY_GET_PATCHS);
        recordset = request.recordset || [];
    }
    catch (error)
    {
        console.log(error);
        return res.status(500).send({error: global.translate.ERROR_IN_DATABASE});
    }

    if (!recordset)
    {
        return res.status(500).send({error: global.translate.NEED_UPDATE});
    }
    return res.send(recordset);
}

module.exports = getPatch;
