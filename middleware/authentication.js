'use strict';

function authRequired(req, res, next)
{
    if (!req.headers['authorization'])
        return res.status(403).send('Forbidden');

    next();
}

module.exports = authRequired;
