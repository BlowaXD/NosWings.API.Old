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
    let replacements = [];
    const filedata = req.body.filedata.data;
    const patchs = {
        ip: req.body.ip,
        port: req.body.port,
        multiclient: req.body.multiclient
    };

    if (!filedata || !patchs.ip || !patchs.port || !patchs.multiclient)
        return res.sendStatus(400);

    const patch_ip = ip(filedata, patchs.ip);
    const patch_port = port(filedata, patchs.port);

    if (patch_ip)
        replacements = replacements.concat(patch_ip);
    if (patch_port)
        replacements = replacements.concat(patch_port);

    if (patchs.multiclient !== true)
        return res.send(replacements);

    const patch_multiclient = multiclient(filedata);

    if (patch_multiclient)
        replacements = replacements.concat(patch_multiclient);
    res.send(replacements);
});

module.exports = router;
