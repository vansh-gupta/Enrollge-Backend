const mongoose = require("mongoose");

const DB = process.env.DATABASE;

 mongoose.connect("mongodb://localhost:27017/enrollge" ,{
     useCreateIndex: true,
     useNewUrlParser: true,
     useUnifiedTopology: true
 }).then(() =>{
     console.log("Connection Succesfull");
 }).catch((e) =>{
     console.log(e);
 })