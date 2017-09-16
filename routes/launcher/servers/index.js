'use strict';

function getServers(req, res) {
    let servers = [];
    for (const server in global.config.servers)
    {
        if (global.config.servers[server].public === true) {
            servers.push(server);
        }
    }
    res.status(200).send(JSON.stringify(servers));
}

module.exports = getServers;
