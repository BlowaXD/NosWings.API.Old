'use strict';
const router = require('express').Router();

router.get('/get_news', require('./home.js'));

module.exports = router;
