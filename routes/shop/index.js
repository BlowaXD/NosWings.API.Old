'use strict';
const express = require('express');

const router = express.Router();

router.get('/packs', require('./packs.js'));

module.exports = router;
