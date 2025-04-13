
const db = require('./db');

const createTables = () => {
  
  const products = `
  CREATE TABLE IF NOT EXISTS otp_verification (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,  -- No default calculation for expiration here
  is_verified BOOLEAN DEFAULT FALSE
   )
  `;

  db.query(products, (err, result) => {
    if (err) {
      console.error('Error creating products table:', err);
    } 
  });

};

// Export function for use in other files
module.exports = createTables;