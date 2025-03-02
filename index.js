const { configDotenv } = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser")
const cors = require("cors");
const app = express();

const createConnection = require("./database/connections")

const authRouter = require("./router/auth")
configDotenv();

createConnection();


app.use(cors({
    origin:Process.env.url || "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.get("/", (req, res) => {
    res.send("<h1>Server is Running</h1>")
});

app.use("/auth",authRouter);


app.listen(process.env.PORT || 3000,()=>{
    console.log(`server is running`)
})