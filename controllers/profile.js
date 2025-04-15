const db = require("../database/db");

const profile = (req, res) => {
  const imagePath = req.file.path;
  const userId = req.user.userId; 

  try {
    
    db.query(
      "UPDATE users SET profile_pic = ? WHERE id = ?",
      [imagePath, userId],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database update failed" });
        }

        res.status(200).json({
          message: "Image uploaded and profile updated successfully",
          url: imagePath,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image upload failed" });
  }
};

module.exports = { profile };
