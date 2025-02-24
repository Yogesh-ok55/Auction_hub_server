const { configDotenv } = require("dotenv");
const express = require("express");
const app = express();
const mysql = require("mysql2")
const authRouter = require("./router/auth")
configDotenv();

const db = mysql.createConnection({
    host: process.env.host,    
    user: process.env.user,         
    password: process.env.password,
    database: process.env.database ,
    port: process.env.database_port
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



app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Server is Running</h1>")
});

app.use("/signup",authRouter);


app.listen(process.env.PORT || 3000,()=>{
    console.log(`server is running`)
})