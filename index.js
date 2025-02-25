const dotenv = require('dotenv');
const express = require("express");
const userRoutes = require('./router/userRoutes');
const app = express();
dotenv.config();



app.use(express.json());

app.get("/",(req,res)=>{
    res.send("app running");
})

app.use("/api/users",userRoutes);




app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`)
})