const express = require("express");
const router = express.Router();

router.post("/forgotten", require("./forgotten"));
router.post("/password", require("./password"));
router.post("/register", require("./register"));
router.post("/auth", require("./login"));

module.exports = router;