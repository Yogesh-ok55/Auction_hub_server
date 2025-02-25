const db = require('./db');

const createTables = () => {
  
  const bids = `
    CREATE TABLE IF NOT EXISTS bids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    buyer_id INT NOT NULL,
    bid_amount DECIMAL(10,2) NOT NULL,
    bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE

 ) `;

  db.query(bids, (err, result) => {
    if (err) {
      console.error('Error creating bids:', err);
    } 
  });

};

// Export function for use in other files
module.exports = createTables;


