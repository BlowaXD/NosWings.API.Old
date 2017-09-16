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
const auth_middleware = require('../../middlewares/authMiddleware.js');
const router = express.Router();

router.use(auth_middleware);
router.use((req, res, next) => {
    if (req.user.permissions.IS_ADMIN) {
        return next();
    }
    res.redirect(req.protocol + '://' + req.get('host') + '/');
});
router.post('/patch', require('./patch.js'));

module.exports = router;
