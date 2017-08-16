/**
 ________                     ___________.__       .__       .___
 /  _____/_____    _____   ____\_   _____/|__| ____ |  |    __| _/
 /   \  ___\__  \  /     \_/ __ \|    __)  |  |/ __ \|  |   / __ |
 \    \_\  \/ __ \|  Y Y  \  ___/|     \   |  \  ___/|  |__/ /_/ |
 \______  (____  /__|_|  /\___  >___  /   |__|\___  >____/\____ |
 \/     \/      \/     \/    \/            \/           \/

 */

const express = require('express');
const router = express.Router();

const ip = require('./ip.js');
const port = require('./port.js');
const multiclient = require('./multiclient.js');

router.post('/', function (req, res) {
    const replacements = [];
    const filedata = req.body.filedata;
    const patchs = {
        ip: req.body.ip,
        port: req.body.port,
        multiclient: req.body.multiclient
    };

    if (!filedata || !patchs.ip || !patchs.port || !patchs.multiclient)
        return res.sendStatus(400);

    replacements.push(ip(filedata, patchs.ip));
    if (patchs.port)
        replacements.push(port(filedata, patchs.port));
    if (patchs.multiclient !== false)
        replacements.push(multiclient(filedata));

    res.send(replacements);
});

module.exports = router;
