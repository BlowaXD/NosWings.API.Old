const express = require('express');
const router = express.Router();

/* GET Packs. */
router.get('/', function (req, res, next) {
    res.render('dashboard', {title: global.translate.TITLE_DASHBOARD});
});

router.get('/login', function (req, res, next) {
    res.render('login', {title: global.translate.TITLE_LOGIN});
});

module.exports = router;
