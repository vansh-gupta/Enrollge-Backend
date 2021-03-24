const express = require("express");
const router = new express.Router();
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");


// First Handle Post Request to Create Admin in the Admin Portal
router.post("/admin/register", async (req, res) => {
    try {
        const { email_address, password, cpassword } = req.body;

        if (!email_address || !password || !cpassword) {
            return (res.status(422).json({ error: "Please fill the Details Properly" }))
        }

        const AdminExist = await Admin.findOne({ email_address: email_address })

        if (AdminExist) {
            return (res.status(422).json({ error: "Email Id Already Exist" }))
        }
        if (password != cpassword) {
            return (res.status(422).json({ error: "Please Enter Same Password" }))
        }

        const AddAdmin = new Admin({ email_address, password, cpassword });
        // Here We Use Pre Function in AdminSchema to hash the Password
        await AddAdmin.save();
    } catch (e) {
        res.send(e)
    }
})

// Now, Here We Create a Api For Login Admin Panel
router.post("/admin/login", async (req, res) => {
    try {
        const { email_address, password } = req.body;

        if (!email_address || !password) {
            return (res.status(422).json({ error: "Please fill the Details Properly" }))
        }

        const AdminExist = await Admin.findOne({ email_address: email_address })

        const isMatch = await bcrypt.compare(password, AdminExist.password);


        if (!isMatch) {
            res.status(422).json({ error: "Invalid Credentails" })
        } else {
            const token = await AdminExist.generateAuthToken();
            res.cookie("jwtadmin", token,{
                expires: new Date(Date.now() + 86400000)
            });
            res.status(201).json({ message: "User Login Successfully" });
        }

    } catch (e) {
        res.status(422).send(e);
    }
})

// First Handle Get Request to get Admin Info
router.get("/admin/:email/:password", async (req, res) => {
    try {
        const email = req.params.email
        const password = req.params.password

        const AdminEmail = await Admin.findOne({ email_address: email });

        if (password === AdminEmail.password) {
            res.status(200).send("Login Successfull")
        } else {
            res.send("Invalid Details");
        }

    } catch (e) {
        res.send(e);
    }
})

module.exports = router;