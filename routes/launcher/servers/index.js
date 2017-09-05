'use strict';

function getServers(req, res)
{
    res.send(global.config.servers.map(s => {
        if (s.public)
            return s;
    }));
}

module.exports = getServers;
