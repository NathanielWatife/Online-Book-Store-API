const express = require("express");
const dotenv = require("dotenv");
require("dotenv").config();
const PORT = process.env.PORT;
const connectDB = require("./config/db");


const app = express()

app.get("", (req, res) =>{
    res.send("Hey, Welcome to My Online: SmartBook Store.")
})
// database connection
connectDB();
app.listen(PORT, () => {
    console.log(`Server application running on localhost:${PORT}`);
});