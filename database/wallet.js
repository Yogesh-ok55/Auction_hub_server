const db = require('./db');

const createTables = () => {
  
  const wallet_transactions = `
    CREATE TABLE IF NOT EXISTS wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    transaction_type ENUM('deposit', 'withdrawal', 'purchase') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  db.query(wallet_transactions, (err, result) => {
    if (err) {
      console.error('Error creating wallets table:', err);
    } 
  });

};

// Export function for use in other files
module.exports = createTables;


