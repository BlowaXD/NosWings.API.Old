'use strict';
const GET_PACKS = `
    SELECT p.*, c.Name AS CName
    FROM _GF_CS_Packs AS p
    JOIN _GF_CS_Categories AS c
        ON c.CategoryId = p.CategoryId
        ORDER BY CategoryId`;

async function get(req, res)
{
    const server = global.config.servers[req.user.server];

    /* Some checks */
    if (!server)
        return res.status(403).send({ success: false, error: global.translate.WRONG_SERVER });

    /* Get packs */
    let recordset;
    try
    {
        const request = await server.db.request()
            .query(GET_PACKS);
        recordset = request.recordset || [];
    }
    catch (error)
    {
        console.log(error);
        return res.status(500).send({ success: false, error: global.translate.ERROR_IN_DATABASE });
    }
    res.send(recordset);
}

module.exports = get;
