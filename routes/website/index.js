'use strict';
const router = require('express').Router();

router.get('/get_news', require('./home.js'));
router.get('/register/:validationtoken', require('./validate.js'));
router.post('/register', require('./register.js'));

module.exports = router;
