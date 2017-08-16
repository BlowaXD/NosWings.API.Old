/**
  ________                     ___________.__       .__       .___
 /  _____/_____    _____   ____\_   _____/|__| ____ |  |    __| _/
/   \  ___\__  \  /     \_/ __ \|    __)  |  |/ __ \|  |   / __ |
\    \_\  \/ __ \|  Y Y  \  ___/|     \   |  \  ___/|  |__/ /_/ |
\______  (____  /__|_|  /\___  >___  /   |__|\___  >____/\____ |
\/     \/      \/     \/    \/            \/           \/

 */

const express = require("express");
const router = express.Router();

const patch = require("./patch/index.js");
const update = require("./update/index.js");

router.post('/patch', patch);
router.post('/update', update);

module.exports = router;