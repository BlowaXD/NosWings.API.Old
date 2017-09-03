'use strict';

function getServers(req, res)
{
    res.send(global.config.servers);
}

module.exports = getServers;
