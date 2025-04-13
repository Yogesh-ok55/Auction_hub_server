const express = require("express");
const router = express.Router();
const {signup,login,verify,sendOtp,tokenVerify,logout} = require("../controllers/auth")

router.post("/signup",signup);
router.post("/login",login);
router.post("/sendOtp",sendOtp);
router.post("/verify",verify);
router.post("/tokenVerify",tokenVerify)
router.post("/logout",logout)


module.exports=router;