/**
 ________                     ___________.__       .__       .___
 /  _____/_____    _____   ____\_   _____/|__| ____ |  |    __| _/
 /   \  ___\__  \  /     \_/ __ \|    __)  |  |/ __ \|  |   / __ |
 \    \_\  \/ __ \|  Y Y  \  ___/|     \   |  \  ___/|  |__/ /_/ |
 \______  (____  /__|_|  /\___  >___  /   |__|\___  >____/\____ |
 \/     \/      \/     \/    \/            \/           \/

 */

const express = require('express');
const router = express.Router();

const sql = require('mssql');
const QUERY_VERIFY_HASH_CLONE = 'SELECT TOP 1 * FROM [dbo].[_GF_Launcher_Patchs] WHERE [Hash] = @hash;';
const QUERY_ADD_PATCH = "INSERT INTO [dbo].[_GF_Launcher_Patchs] ([Hash], [Ip], [Port], [Multiclient]) VALUES (@hash, @ip, @port, @multiclient)";
const QUERY_ADD_PATCH_VALUES = "INSERT INTO [dbo].[_GF_Launcher_PatchValues] ([HashId], [Offset], [Value]) VALUES (@hashid, @offset, @data)";

router.post('/patch', async function (req, res) {
    const patch = {
        ip: req.body.ip,
        port: req.body.port,
        multiclient: req.body.multiclient === 'on',
        hash: req.body.hash,
        patchs: req.body.patchs
    };

    if (!patch.ip || !patch.port || !patch.multiclient || !patch.hash || !patch.patchs) {
        return res.sendStatus(400);
    }

    /* CHECK IF HASH IS ALREADY TAKEN */
    let recordset;
    try {
        await sql.connect(config.db);

        const request = new sql.Request();
        request.input('hash', sql.VarChar, hash);
        recordset = await request.query(`${QUERY_VERIFY_HASH_CLONE}`);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }

    recordset = recordset.recordset;
    /* If yes, throw an error */
    if (recordset.length !== 0) {
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }

    /* Await the BD connection & UPLOAD A NEW PATCH IF HASH IS NOT TAKEN */
    try {
        const request = new sql.Request();
        request.input('hash', sql.VarChar, hash);
        request.input('ip', sql.VarChar, patchs.ip);
        request.input('port', sql.SmallInt, Number(patchs.port));
        request.input('multiclient', sql.Bit, patchs.multiclient === true ? 1 : 0);
        recordset = await request.query(`${QUERY_ADD_PATCH} ${QUERY_VERIFY_HASH_CLONE}`);
    }
    catch (error) {
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }

    const patchId = recordset.recordset[0].Id;

    if (!patchId) {
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }

    /* UPLOAD NEW PATCH VALUES */
    for (const replacement of patchs.patch) {
        try {
            const request = new sql.Request();
            request.input('hashid', sql.BigInt, patchId);
            request.input('offset', sql.BigInt, replacement.offset);
            request.input('data', sql.SmallInt, replacement.data);
            recordset = await request.query(`${QUERY_ADD_PATCH_VALUES}`);
        }
        catch (error) {
            sql.close();
            return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
        }
    }

    return res.render('patch', {success: 'Patch applied successfully'});
});

module.exports = router;
