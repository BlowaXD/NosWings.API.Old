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
    return res.send([ { offset: 734944, data: 9 },
        { offset: 734948, data: 49 },
        { offset: 734949, data: 50 },
        { offset: 734950, data: 55 },
        { offset: 734951, data: 46 },
        { offset: 734952, data: 48 },
        { offset: 734953, data: 46 },
        { offset: 734954, data: 48 },
        { offset: 734955, data: 46 },
        { offset: 734956, data: 49 },
        { offset: 734957, data: 0 },
        { offset: 734958, data: 0 },
        { offset: 734959, data: 0 },
        { offset: 734960, data: 0 },
        { offset: 734961, data: 0 },
        { offset: 734962, data: 0 },
        { offset: 734968, data: 9 },
        { offset: 734972, data: 49 },
        { offset: 734973, data: 50 },
        { offset: 734974, data: 55 },
        { offset: 734975, data: 46 },
        { offset: 734976, data: 48 },
        { offset: 734977, data: 46 },
        { offset: 734978, data: 48 },
        { offset: 734979, data: 46 },
        { offset: 734980, data: 49 },
        { offset: 734981, data: 0 },
        { offset: 734982, data: 0 },
        { offset: 734983, data: 0 },
        { offset: 734984, data: 0 },
        { offset: 734985, data: 0 },
        { offset: 734986, data: 0 },
        { offset: 1148944, data: 185 },
        { offset: 1148945, data: 186 },
        { offset: 1148946, data: 19 },
        { offset: 1148947, data: 0 },
        { offset: 1148948, data: 0 },
        { offset: 1148949, data: 144 },
        { offset: 1148950, data: 144 },
        { offset: 1148951, data: 144 },
        { offset: 2697837, data: 235 },
        { offset: 2697838, data: 66 },
        { offset: 2697839, data: 144 },
        { offset: 2697840, data: 144 },
        { offset: 2697841, data: 144 },
        { offset: 2697842, data: 144 } ]);
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
