require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

mongoose.connect("mongodb://localhost:27017/email-verify")
  .then(() => {
    app.listen(5000, () => console.log("Server started at http://localhost:5000"));
  });
app.listen(8080,()=>{
    console.log("server are run port 8080");
}
