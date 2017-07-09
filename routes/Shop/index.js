const express = require('express');
const router = express.Router();

/* GET Packs. */
router.get('/', function (req, res) {
    res.render('dashboard', {title: global.translate.TITLE_DASHBOARD});
});

router.get('/catalogue/', function (req, res) {
    res.render('catalogue', {title: global.translate.TITLE_DASHBOARD});
});

router.get('/login', function (req, res) {
    res.render('login', {title: global.translate.TITLE_LOGIN});
});

module.exports = router;
