'use strict';
const express = require('express');

const router = express.Router();

router.get('/token', require('./token.js'));

module.exports = router;
