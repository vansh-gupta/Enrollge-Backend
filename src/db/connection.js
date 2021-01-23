const mongoose = require("mongoose");

 mongoose.connect("mongodb+srv://VidMax:EW03F6qjEzb4yVUQ@cluster0.h279k.mongodb.net/VidMaxretryWrites=true&w=majority",{
     useCreateIndex: true,
     useNewUrlParser: true,
     useUnifiedTopology: true
 }).then(() =>{
     console.log("Connection Succesfull");
 }).catch((e) =>{
     console.log(e);
 })