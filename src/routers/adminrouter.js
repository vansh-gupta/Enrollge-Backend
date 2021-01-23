const express = require("express");
const router = new express.Router();
const Admin = require("../models/admin");


// First Handle Post Request to Create Admin
router.post("/admin", async(req, res)=>{
    try{
        const AddAdmin = new Admin(req.body)
        const insertAdmin = await AddAdmin.save();
        res.send(insertAdmin);
    }catch(e){
        res.send(e)
    }
})

// First Handle Get Request to get Admin Info
router.get("/admin/:email/:password", async(req, res)=>{
    try{
       const email = req.params.email
       const password = req.params.password

       const AdminEmail = await Admin.findOne({email_address:email});

       if(password === AdminEmail.password){
           res.status(200).send("Login Successfull")
       } else{
           res.send("Invalid Details");
       }

    }catch(e){
        res.send(e);
    }
})

module.exports = router;