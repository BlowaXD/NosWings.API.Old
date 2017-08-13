/**
 * Created by Blowa on 6/15/2017.
 */

const express = require("express");
const router = express.Router();


const management = require("./management");


router.use(management);

module.exports = router;
