const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const db = require("../database/db");
const transporter = require("../transporter")


require("dotenv").config();


const signup = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(500).json({ message: "All fields are required" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const query = `
            INSERT INTO users (username, email, password_hash, wallet_balance, created_at, updated_at)
            VALUES (?, ?, ?, 0.00 , NOW(), NOW())`;

    db.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, username:user.name,email:user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

      // Set token in an HTTP-only cookie
      res.cookie("authToken", token, {
        httpOnly: true,   // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        maxAge: 60 * 60 * 1000, // Cookie expires in 1 hour
        sameSite: "strict", // Prevents CSRF attacks
      });

      res.status(201).json({
        message: "User registered successfully",
        user: { id: result.insertId, username, email },
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
      const token = jwt.sign({ userId: user.id, username:user.name,email:user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
      res.status(200).json({ message: "Login successful!", userData:{
        username:user.username,
        email:user.email,
        profile_pic:user.profile_pic
      } });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
}

const sendOtp = async (req, res) => {
  const { email } = req.body;

  console.log(email);

  const query = `select * from users where email=?`;

  db.query(query, [email], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.length > 0) {
      console.error(err);
      return res.status(400).json({ message: "email id is already registered" });
    }
  })

  const generatedOTP = Math.floor(100000 + Math.random() * 900000);
  const expirationTime = new Date(Date.now() + 5 * 60);

  const checkOtpQuery = `SELECT * FROM otp_verification WHERE email = ?`;

  db.query(checkOtpQuery, [email], (err, otpResult) => {
    if (err) {
      console.error("Error checking OTP:", err);
      return res.status(500).json({ message: "Failed to verify OTP entry" });
    }

    if (otpResult.length > 0) {

      const updateOtpQuery = `UPDATE otp_verification SET otp = ?, created_at = NOW(), expires_at = ? WHERE email = ?`;

      db.query(updateOtpQuery, [generatedOTP, expirationTime, email], (err) => {
        if (err) {
          console.error("Error updating OTP:", err);
          return res.status(500).json({ message: "Failed to update OTP" });
        }

      });

    } else {
      // Email does not exist — insert new OTP
      const insertOtpQuery = `INSERT INTO otp_verification (email, otp, created_at, expires_at) VALUES (?, ?, NOW(), ?)`;

      db.query(insertOtpQuery, [email, generatedOTP, expirationTime], (err) => {
        if (err) {
          console.error("Error inserting OTP:", err);
          return res.status(500).json({ message: "Failed to store OTP" });
        }

      });
    }
  });


  const sendOTPEmail = async (toEmail, otp) => {


    const mailOptions = {
      from: 'yogeshh.ok@gmail.com',  // Sender email address
      to: toEmail,  // Recipient email address
      subject: 'Your OTP for AuctionHub',  // Email subject
      html: `<!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f7f7f7;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 500px;
              margin: 40px auto;
              background: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }
            .otp {
              font-size: 28px;
              font-weight: bold;
              color: #4caf50;
              text-align: center;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              font-size: 13px;
              color: #888;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 style="text-align:center;">Your OTP for AuctionHub</h2>
            <p>Hello,</p>
            <p>Please use the following OTP to continue:</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for 5 minutes.</p>
            <div class="footer">
              <p>If you didn’t request this, please ignore the email.</p>
            </div>
          </div>
        </body>
      </html>`
    };

    try {

      const info = await transporter.sendMail(mailOptions);
        console.log('OTP Email sent: ' + info.response);
    } catch (error) {
      console.log('Error sending email:', error);
      res.status(500).json({ message: "unable to send otp" })
    }
  };
console.log("h")
  await sendOTPEmail(email, generatedOTP);
  res.status(200).send("otp sent");
}

const verify = async (req, res) => {
  const { email, otp } = req.body

  const otp_query = `select * from otp_verification where email=?`;

  db.query(otp_query, [email], (err, result) => {
    if (err) {
      res.status(400).json({ message: "some problem while verifying!" });
      return;
    }

    if (result.length == 0) {
      res.status(400).json({ message: "Please resend the otp...!" });
      return;
    }
    const storedOtp = result[0].otp;
    const expiresAt = new Date(result[0].expires_at);
    const now = new Date();

    if (storedOtp == otp) {
      res.status(200).json({ message: "Success" });
      return;
    } else {
      res.status(400).json({ message: "Invalid OTP or it has expired. Please try again." });
      return;
    }
  })

}

const tokenVerify = (req, res) => {

  
  
 
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }
    console.log(process.env.JWT_SECRET);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 

      db.query("SELECT * FROM users WHERE id = ?", [req.user.userId], async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database error!" });
        }
  
        if (results.length === 0) {
          return res.status(400).json({ message: "User not found!" });
        }
        const user = results[0];
      
      
        
  
      
      console.log(decoded);

      return res.status(200).json({message:"success",
        userData:{
          username:user.username,
          email:user.email,
          profile_pic:user.profile_pic
        }
      });
      })
    
    } catch (err) {
      return res.status(403).json({message:"Invalid token"});
    }
 

}

const logout = (req,res) => {
  const token = req.cookies.token;
  
  console.log("token: "+token)
  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }
  console.log(process.env.JWT_SECRET);
  try {
    res.clearCookie("token");
    return res.status(200).json({message:"success"});
  } catch (err) {
    return res.status(403).json({message:"Some issue"});
  }
}

module.exports = { signup, login, sendOtp, verify, tokenVerify ,logout};