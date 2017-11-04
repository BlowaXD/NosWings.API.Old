'use strict';
const router = require('express').Router();

router.get('/ranking/:rankingType', require('./ranking.js'));
router.get('/get_news', require('./home.js'));
router.get('/register/validate/:validationtoken', require('./validate.js'));
router.get('/online', require('./online.js'));
router.post('/register', require('./register.js'));

module.exports = router;
