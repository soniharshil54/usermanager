const express = require('express')
const mongoose = require('mongoose')
const db = require("./configs/config").mongoURI
const userRoutes = require("./routes/api/users")
const bodyParser = require("body-parser")
const fs = require("fs")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




mongoose.connect(db,()=> console.log("connected to mongodb"))

app.get('/display', function(req, res) {
  fs.readFile('routes/banner.jpg', function(err, data) {
    if (err) throw err; // Fail if the file can't be read.
    else {
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.end(data); // Send the file data to the browser.
    }
  });
  // res.end("image")
});
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
app.use("/api/user",userRoutes)
app.use('/profileUploads', express.static('profileUploads'));


const port = process.env.PORT || 5000;
app.listen(port,()=>console.log(`server connected on localhost:${port}`));