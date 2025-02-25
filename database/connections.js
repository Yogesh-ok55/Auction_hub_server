
const users = require('./users')
const produts = require('./products')
const bids = require('./bids')
const transaction = require('./transaction')
const wallet = require('./wallet')

const createTables = () => {

    
        users();
        produts();
        bids();
        transaction();
        wallet();
    
  
};

// Export function for use in other files
module.exports = createTables;
