const express = require("express");
const router = express.Router();
const {profile} = require("../controllers/profile")
const tokenAuth = require("../middleware/token")
const upload = require('../upload');

router.post("/profileImage",upload.single('image'),tokenAuth,profile)


module.exports=router;