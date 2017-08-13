'use strict';
const jwt = require('jsonwebtoken');
const secret = require('../Config/secret.js');

function authRequired(req, res, next)
{
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token)
        return res.sendStatus(403);

    try
    {
        req.user = jwt.verify(token, secret.jwt_key);
    }
    catch(err)
    {
        return res.sendStatus(403);
    }
    next();
}

module.exports = authRequired;
