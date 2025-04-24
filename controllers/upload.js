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

const productUpload  = async(req,res)=>{
  try {
    const {
      title,
      description,
      starting_bid,
      category,
      seller_id,
    } = req.body;

     const imagePath = req.file.path
    console.log(imagePath);
    // console.log(req.file.path)

    const insertQuery = `
      INSERT INTO products
        (seller_id, name, description, category,starting_price, current_price, status, created_at,updated_at, product_image)
      VALUES (?, ?, ?, ?,?, ?, ?, NOW(), NOW(), ?)
    `;

    const values = [
      seller_id,
      title,
      description,
      category,
      starting_bid,
      starting_bid,
      "Active",
      imagePath,
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("DB error inside query:", err);
        return res.status(500).json({ error: 'Database error', details: err });
      }
    
      const insertedId = result.insertId;
    
      // Now fetch the inserted product
      const fetchQuery = 'SELECT * FROM products WHERE id = ?'; 
      db.query(fetchQuery, [insertedId], (fetchErr, fetchResult) => {
        if (fetchErr) {
          console.error("Error fetching inserted product:", fetchErr);
          return res.status(500).json({ error: 'Error fetching product', details: fetchErr });
        }
    
        const product = fetchResult[0];
    
        res.status(200).json({
          message: 'Product created successfully',
          data: {
            id: product.id,
            title: product.title,
            description: product.description,
            images: [product.product_image],
            startingBid: product.starting_price,
            currentBid: product.current_price,
            seller: product.seller_id,
            bids:[],
            endTime: product.created_at,
            category: product.category
          }
        });
      });
    });
  } catch (error) {
    console.log('Error uploading product:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }

}

const getProduct = (req,res)=>{
  const query = 'SELECT * FROM products ORDER BY created_at DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: 'Database error', details: err });
    }

    const formattedProducts = results.map((product) => ({
      id: product.id,
      title: product.name,
      description: product.description,
      images: [product.product_image], 
      startingBid: product.starting_price,
      currentBid: product.current_price,
      seller: product.seller_id,
      bids:[],
      endTime: product.created_at, 
      category: product.category,
    }));

    res.status(200).json({ products: formattedProducts })
})
}
module.exports = { profile,productUpload,getProduct };
