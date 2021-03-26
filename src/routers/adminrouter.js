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

        res.send("Register Successfull")
    } catch (e) {
        res.status(402).send(e)
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

        const token = await AdminExist.generateAuthToken();

        res.cookie("jwtadmin", token, {
            expires: new Date(Date.now() + 86400000)
        });

        if (!isMatch) {
            res.send(false);
        } else {
            res.status(201).send(true);
        }

    } catch (e) {
        res.status(422).send(e);
    }
})

module.exports = router;