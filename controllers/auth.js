const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const db = require("../database/db");

require("dotenv").config();


const signup = async (req,res)=>{
    try {
        console.log(req.body);
        const { username, email, password, role } = req.body;
          
        if (!username || !email || !password || !role) {
            return res.status(500).json({ message: "All fields are required" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const query = `
            INSERT INTO users (username, email, password_hash, role, wallet_balance, rating, verified, created_at, updated_at)
            VALUES (?, ?, ?, ?, 0.00, 0.0, 0, NOW(), NOW())`;

        db.query(query, [username, email, hashedPassword, role], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Database error" });
            }

            // Generate JWT token
            const token = jwt.sign({ id: result.insertId, role }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });

            // Set token in an HTTP-only cookie
            res.cookie("authToken", token, {
                httpOnly: true,   // Prevents client-side JavaScript from accessing the cookie
                secure: process.env.NODE_ENV === "production", // Use HTTPS in production
                maxAge: 60 * 60 * 1000, // Cookie expires in 1 hour
                sameSite: "strict", // Prevents CSRF attacks
            });

            res.status(201).json({
                message: "User registered successfully",
                user: { id: result.insertId, username, email, role },
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(req.body);

        // Check if user exists in the database
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Database error!" });
            }

            if (results.length === 0) {
                return res.status(400).json({ message: "User not found!" });
            }

            const user = results[0];

            // Compare the password
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials!" });
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            
            res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
            res.status(200).json({ message: "Login successful!", token });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error!" });
    }
}

module.exports={signup,login};