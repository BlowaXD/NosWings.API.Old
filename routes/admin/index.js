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
const perm_middleware = require('../../middlewares/permMiddleware.js');
const router = express.Router();

router.use(auth_middleware);
router.use(perm_middleware);
router.use((req, res, next) => {
    if (req.user.permissions.IS_ADMIN) {
        return next();
    }
    res.redirect(req.protocol + '://' + req.get('host') + '/');
});
router.post('/patch', require('./patch.js'));
router.post('/addMoney', require('./addMoney.js'));

module.exports = router;
