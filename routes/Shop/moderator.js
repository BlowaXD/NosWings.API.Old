'use strict';
const express = require('express');
const router = express.Router();
const authentication = require('../../middleware/authentication');

/* GET Packs. */
router.use(authentication);
router.get('/', function (req, res) {
    res.render('moderator/dashboard', {title: global.translate.TITLE_DASHBOARD});
});

module.exports = router;
