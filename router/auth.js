const express = require("express");
const router = express.Router();
const {signup} = require("../controllers/auth")

router.get("/data",signup);

module.exports=router;