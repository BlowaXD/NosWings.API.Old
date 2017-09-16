/**
 ________                     ___________.__       .__       .___
 /  _____/_____    _____   ____\_   _____/|__| ____ |  |    __| _/
 /   \  ___\__  \  /     \_/ __ \|    __)  |  |/ __ \|  |   / __ |
 \    \_\  \/ __ \|  Y Y  \  ___/|     \   |  \  ___/|  |__/ /_/ |
 \______  (____  /__|_|  /\___  >___  /   |__|\___  >____/\____ |
 \/     \/      \/     \/    \/            \/           \/

 */

const sql = require('mssql');
const QUERY_VERIFY_HASH_CLONE = 'SELECT TOP 1 * FROM [dbo].[_GF_Launcher_Patchs] WHERE [Hash] = @hash;';
const QUERY_ADD_PATCH = "INSERT INTO [dbo].[_GF_Launcher_Patchs] ([Hash], [Ip], [Port], [Multiclient]) VALUES (@hash, @ip, @port, @multiclient)";
const QUERY_ADD_PATCH_VALUES = "INSERT INTO [dbo].[_GF_Launcher_PatchValues] ([HashId], [Offset], [Value]) VALUES (@hashid, @offset, @data)";

async function post(req, res) {
    const server = global.config.servers[req.body.server || 'NosWings'];
    const patch = {
        ip: req.body.ip,
        port: req.body.port,
        multiclient: req.body.multiclient,
        hash: req.body.hash,
        patchs: req.body.patchs
    };

    if (!patch.ip || !patch.port || !patch.multiclient || !patch.hash || !patch.patchs) {
        return res.sendStatus(400);
    }

    /* CHECK IF HASH IS ALREADY TAKEN */
    let recordset;
    try {
        const request = await server.db.request()
            .input('hash', sql.VarChar,patch.hash)
            .query(QUERY_VERIFY_HASH_CLONE);
        recordset = request.recordset || [];
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }
    console.log('bite');

    /* If yes, throw an error */
    if (recordset.length !== 0) {
        console.log(recordset);
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }

    /* Await the BD connection & UPLOAD A NEW PATCH IF HASH IS NOT TAKEN */
    try {
        const request = await server.db.request()
            .input('hash', sql.VarChar, patch.hash)
            .input('ip', sql.VarChar, patch.ip)
            .input('port', sql.SmallInt, Number(patch.port))
            .input('multiclient', sql.Bit, patch.multiclient === true ? 1 : 0)
            .query(`${QUERY_ADD_PATCH} ${QUERY_VERIFY_HASH_CLONE}`);
        recordset = request.recordset || [];
    }
    catch (error) {
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }

    const patchId = recordset.recordset[0].Id;

    if (!patchId) {
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }

    /* UPLOAD NEW PATCH VALUES */
    for (const replacement of patch.patchs) {
        try {
            await server.db.request()
                .input('hashid', sql.BigInt, patchId)
                .input('offset', sql.BigInt, replacement.offset)
                .input('data', sql.SmallInt, replacement.data)
                .query(`${QUERY_ADD_PATCH_VALUES}`);
        }
        catch (error) {
            return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
        }
    }

    return res.status(200).send({success: true});
}

module.exports = post;
