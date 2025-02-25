const { configDotenv } = require("dotenv");
configDotenv();
const mysql = require("mysql2")

const db = mysql.createConnection({
    host: process.env.host || "localhost",    
    user: process.env.user || "admin",         
    password: process.env.password || "9338YOg@",
    database: process.env.database || "auction",
    port: process.env.database_port || 3306
})

db.connect((err)=>{
    if(err){
        console.log(err);
        return ;
    }
    else{
        console.log("connected successfully")
    }
})

module.exports=db;
