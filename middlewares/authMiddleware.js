'use strict';
const jwt = require('jsonwebtoken');

function authRequired(req, res, next)
{
    const token = req.headers['x-access-token'];
    const dtoken = jwt.decode(token);

    if (!dtoken || !dtoken.server)
        return res.sendStatus(403);

    /* Server check */
    const server = config.servers[dtoken.server];
    if (!server)
        return res.sendStatus(403);

    /* JWT check */
    const vtoken = jwt.verify(token, server.tokenSecret);
    if (!vtoken)
        return res.sendStatus(403);

    /* Ok */
    req.user = vtoken;
    next();
}

module.exports = authRequired;
