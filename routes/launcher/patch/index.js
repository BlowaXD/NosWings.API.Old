/**
 * Created by Blowa on 6/15/2017.
 */
const express = require(express);
const router = express.router;

const ip = require("./ip.js");
const port = require("./port.js");
const multiclient = require("./multiclient.js");

router.post("/update", function (req, res) {
    let replacements = [];
    replacements.push(ip(filedata));
    if (changePort)
        replacements.push(port(filedata));
    if (setMulticlient)
        replacements.push(multiclient(filedata));
});

module.exports = router;