'use strict';
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(global.config.servers);
});

module.exports = router;
