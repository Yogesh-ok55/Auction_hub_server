const jwt = require('jsonwebtoken');
const db = require('../database/db'); 

const tokenVerify = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    db.query("SELECT * FROM users WHERE id = ?", [req.user.userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error!" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "User not found!" });
      }

      // Attach user info to req for later access
      req.userData = {
        username: results[0].username,
        email: results[0].email,
        profile_pic: results[0].profile_pic
      };

      next(); 
    });

  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = tokenVerify
