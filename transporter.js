const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',  
  auth: {
    user: 'yogeshh.ok@gmail.com',  
    pass: 'dphe tpfm lekb wntc',  
  },
});

module.exports = transporter; 
