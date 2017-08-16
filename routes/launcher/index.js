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

router.use('/login', require('./login'));
router.use('/patch', require('./patch'));
/* router.use('/update', require('./update')); */

module.exports = router;
