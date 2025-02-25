const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");



// router.post("/register", registerUser);
router.get("/register", (req, res) => {
    res.send("This is a GET request to register route");
});


router.post("/login", loginUser);
router.get("/login", (req, res) => {
    res.send("This is a GET request to login route");
});


module.exports = router;
