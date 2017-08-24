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
    return res.send([ { offset: 735004, data: 15 },
        { offset: 735008, data: 49 },
        { offset: 735009, data: 54 },
        { offset: 735010, data: 52 },
        { offset: 735011, data: 46 },
        { offset: 735012, data: 49 },
        { offset: 735013, data: 51 },
        { offset: 735014, data: 50 },
        { offset: 735015, data: 46 },
        { offset: 735016, data: 50 },
        { offset: 735017, data: 48 },
        { offset: 735018, data: 54 },
        { offset: 735019, data: 46 },
        { offset: 735020, data: 49 },
        { offset: 735021, data: 56 },
        { offset: 735022, data: 49 },
        { offset: 735028, data: 15 },
        { offset: 735032, data: 49 },
        { offset: 735033, data: 54 },
        { offset: 735034, data: 52 },
        { offset: 735035, data: 46 },
        { offset: 735036, data: 49 },
        { offset: 735037, data: 51 },
        { offset: 735038, data: 50 },
        { offset: 735039, data: 46 },
        { offset: 735040, data: 50 },
        { offset: 735041, data: 48 },
        { offset: 735042, data: 54 },
        { offset: 735043, data: 46 },
        { offset: 735044, data: 49 },
        { offset: 735045, data: 56 },
        { offset: 735046, data: 49 },
        { offset: 735052, data: 15 },
        { offset: 735056, data: 49 },
        { offset: 735057, data: 54 },
        { offset: 735058, data: 52 },
        { offset: 735059, data: 46 },
        { offset: 735060, data: 49 },
        { offset: 735061, data: 51 },
        { offset: 735062, data: 50 },
        { offset: 735063, data: 46 },
        { offset: 735064, data: 50 },
        { offset: 735065, data: 48 },
        { offset: 735066, data: 54 },
        { offset: 735067, data: 46 },
        { offset: 735068, data: 49 },
        { offset: 735069, data: 56 },
        { offset: 735070, data: 49 },
        { offset: 735076, data: 15 },
        { offset: 735080, data: 49 },
        { offset: 735081, data: 54 },
        { offset: 735082, data: 52 },
        { offset: 735083, data: 46 },
        { offset: 735084, data: 49 },
        { offset: 735085, data: 51 },
        { offset: 735086, data: 50 },
        { offset: 735087, data: 46 },
        { offset: 735088, data: 50 },
        { offset: 735089, data: 48 },
        { offset: 735090, data: 54 },
        { offset: 735091, data: 46 },
        { offset: 735092, data: 49 },
        { offset: 735093, data: 56 },
        { offset: 735094, data: 49 },
        { offset: 1149004, data: 185 },
        { offset: 1149005, data: 162 },
        { offset: 1149006, data: 15 },
        { offset: 1149007, data: 0 },
        { offset: 1149008, data: 0 },
        { offset: 1149009, data: 144 },
        { offset: 1149010, data: 144 },
        { offset: 1149011, data: 144 },
        { offset: 2697961, data: 235 },
        { offset: 2697962, data: 66 },
        { offset: 2697963, data: 144 },
        { offset: 2697964, data: 144 },
        { offset: 2697965, data: 144 },
        { offset: 2697966, data: 144 }
    ]);
    let replacements = [];
    const server = req.body.server || 'NosWings';
    const filedata = req.body.filedata.data;
    const patchs = {
        ip: global.config[server].ip,
        port: global.config[server].port,
        multiclient: global.config[server].multiclient
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
