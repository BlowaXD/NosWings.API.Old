'use strict';
const jwt = require('jsonwebtoken');

function authRequired(req, res, next)
{
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token)
        return res.sendStatus(403);

    /*
    ** Vérification du JWT
    */

    next();
}

module.exports = authRequired;
