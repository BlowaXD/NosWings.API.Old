/**
 ________                     ___________.__       .__       .___
 /  _____/_____    _____   ____\_   _____/|__| ____ |  |    __| _/
 /   \  ___\__  \  /     \_/ __ \|    __)  |  |/ __ \|  |   / __ |
 \    \_\  \/ __ \|  Y Y  \  ___/|     \   |  \  ___/|  |__/ /_/ |
 \______  (____  /__|_|  /\___  >___  /   |__|\___  >____/\____ |
 \/     \/      \/     \/    \/            \/           \/

 */

const express = require('express');
const config = require('../../../Config/config');
const router = express.Router();
const sql = require("mssql");

const QUERY_GET_PATCHS = "SELECT\n" +
    "  [Offset],\n" +
    "  [Value]\n" +
    "FROM _GF_Launcher_PatchValues\n" +
    "  JOIN _GF_Launcher_Patchs ON _GF_Launcher_PatchValues.HashId = _GF_Launcher_Patchs.Id\n" +
    "WHERE Hash = @hash;";

router.post('/', async function (req, res) {

    const hash = req.body.hash;

    sql.close();
    /* Await the BD connection & check if username is already taken */
    let recordset;
    try {
        await sql.connect(config.db);

        const request = new sql.Request();
        request.input('hash', sql.VarChar, hash);
        recordset = await request.query(QUERY_GET_PATCHS);
    }
    catch (error) {
        sql.close();
        console.log(error);
        return res.status(500).send({error: global.translate.ERROR_IN_DATABASE});
    }

    const replacements = recordset.recordset;
    console.error(replacements);

    if (!remplacement)
    {
        return res.status(500).send({error: global.translate.ERROR_IN_DATABASE});
    }

    return res.send(replacements);
});

module.exports = router;
