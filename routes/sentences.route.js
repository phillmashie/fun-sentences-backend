const express = require("express");
const router = express.Router();

//login and register, check number routes,password_recovery
const sentences = require("../controllers/sentences.controller");
router.use("/sentences", sentences);

module.exports = router;
