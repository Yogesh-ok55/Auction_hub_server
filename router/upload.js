const express = require("express");
const router = express.Router();
const {profile,productUpload,getProduct} = require("../controllers/upload")
const tokenAuth = require("../middleware/token")
const upload = require('../multer');

router.post("/profileImage",upload.single('image'),tokenAuth,profile)
router.post("/productListings",upload.single('image'),productUpload)
router.get("/getProduct",getProduct)

module.exports=router;