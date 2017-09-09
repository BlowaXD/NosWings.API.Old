'use strict';
const sql = require('mssql');

async function get(req, res)
{

    const server = global.config.servers[req.user.server];

    /* Some checks */
    if (!server)
        return res.status(403).send({ success: false, error: global.translate.WRONG_SERVER });

    console.log(req.user, req.body);

    res.sendStatus(200);
}

module.exports = get;
