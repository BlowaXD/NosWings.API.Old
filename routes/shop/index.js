'use strict';
const router = require('express').Router();
const auth_middleware = require('../../middlewares/authMiddleware.js');

router.use(auth_middleware);
router.get('/packs', require('./packs.js'));
router.post('/buy', require('./buy.js'));

module.exports = router;
