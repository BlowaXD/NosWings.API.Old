'use strict';
const express = require('express');

const router = express.Router();

router.get('/token', require('./token.js'));
router.get('/get_info', require('./get_info.js'));

module.exports = router;
