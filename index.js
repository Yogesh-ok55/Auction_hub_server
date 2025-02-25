const { configDotenv } = require("dotenv");
const express = require("express");
const app = express();
const createConnection = require("./database/connections")

const authRouter = require("./router/auth")
configDotenv();

createConnection();


app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Server is Running</h1>")
});

app.use("/auth",authRouter);


app.listen(process.env.PORT || 3000,()=>{
    console.log(`server is running`)
})