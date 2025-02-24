const { configDotenv } = require("dotenv");
const express = require("express");
const app = express();
configDotenv()

const authRouter = require("./router/auth")

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("app running");
})

app.use("/signup",authRouter);


app.listen(process.env.PORT || 3000,()=>{
    console.log(`server running on port ${process.env.PORT}`)
})