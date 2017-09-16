/**
  ________                     ___________.__       .__       .___
 /  _____/_____    _____   ____\_   _____/|__| ____ |  |    __| _/
/   \  ___\__  \  /     \_/ __ \|    __)  |  |/ __ \|  |   / __ |
\    \_\  \/ __ \|  Y Y  \  ___/|     \   |  \  ___/|  |__/ /_/ |
\______  (____  /__|_|  /\___  >___  /   |__|\___  >____/\____ |
\/     \/      \/     \/    \/            \/           \/

 */
'use strict';
const express = require('express');

const router = express.Router();

router.get('/servers', require('./servers'));
router.get('/update', require('./update/checkUpdate.js'));
router.get('/patch', require('./patch'));
router.post('/login', require('./login'));

module.exports = router;
