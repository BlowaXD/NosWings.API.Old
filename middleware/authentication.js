'use strict';
const jwt = require('jsonwebtoken');
const secret = require('../Config/secret.js');

function authRequired(req, res, next)
{
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token)
        return res.redirect(req.protocol + '://' + req.get('host') + '/login');

    try
    {
        req.user = jwt.verify(token, secret.jwt_key);
    }
    catch(err)
    {
        res.redirect(req.protocol + '://' + req.get('host') + '/login');
    }

    next();
}

module.exports = authRequired;
