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
            return (res.send("AdminExist"));
        }
        if (password != cpassword) {
            return (res.status(422).json({ error: "Please Enter Same Password" }))
        }

        const AddAdmin = new Admin({ email_address, password, cpassword });
        // Here We Use Pre Function in AdminSchema to hash the Password
        await AddAdmin.save();

        res.send(true)
    } catch (e) {
        res.send(false)
    }
})

// Now, Here We Create a Api For Login Admin Panel
router.post("/admin/login", async (req, res) => {
    try {
        const { email_address, password } = req.body;

        if (!email_address || !password) {
            return (res.status(402).json({ error: "Please fill the Details Properly" }))
        }

        const AdminExist = await Admin.findOne({ email_address: email_address })

        if (!AdminExist) {
            res.send(false)
        }

        const isMatch = await bcrypt.compare(password, AdminExist.password);

        const token = await AdminExist.generateAuthToken();

        if (!isMatch) {
            res.json({ "Login": false })
        } else {
            res.cookie("jwtadmin", token, {
                expires: new Date(Date.now() + 86400000),
                httpOnly: true,
                secure: false
            });
            res.status(201).json({ "Login": true, "Token": token });
        }

    } catch (e) {
        res.status(422).send(e);
    }
})

// Now We Handle Post Request For Changing Password of Admin Panel 
router.post('/admin/resetpassword', async (req, res) => {
    try {
        const email_address = req.query.gmail
        const { Password, CPassword } = req.body
        if (Password === CPassword) {
            const HashPassword = await bcrypt.hash(Password, 12);
            const HashCPassword = await bcrypt.hash(CPassword, 12);
            await Admin.findOneAndUpdate({ email_address: new RegExp(email_address, 'i') }, { Password: HashPassword, CPassword: HashCPassword }, { new: true });
            res.status(200).send({ PasswordChange: true });
        } else {
            res.status(422).send("Please Enter the Same Password");
        }
    } catch (error) {
        res.status(401).send({ PasswordChange: false });
    }
})

//  Here We Handle the Api to get last element of array
router.post('/admin/token/:email', async (req, res) => {
    try {
        const email = req.params.email
        const token = await Admin.find({ email_address: email }, { 'tokens': { $slice: -1 } })
        res.send(token)
    } catch (e) {
        res.send(e)
    }

})

module.exports = router;