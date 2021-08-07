const express = require("express");
const router = new express.Router();
const Admin = require("../../models/admin");
const bcrypt = require("bcryptjs");


// Handle POST Request, to Create Admin Panel's Account for the Admin Portal
router.post("/admin/account/register", async (req, res) => {
    try {
        const { email_address, password, cpassword } = req.body;

        const AdminExist = await Admin.findOne({ email_address: email_address })

        if (AdminExist) {
            return (res.send({ error: `An account with Email ${email_address} already exists.` }));
        }
        if (password != cpassword) {
            return (res.send({ error: "Please enter the same password" }));
        }

        const AddAdmin = new Admin({ email_address, password, cpassword });
        // Here We Use Pre Function in AdminSchema to hash the Password
        await AddAdmin.save();

        res.send('OK');
    } catch (e) {
        res.send({ error: e });
    }
})

// Handle POST Request, For Login Admin Panel's Account
router.post("/admin/account/login", async (req, res) => {
    try {
        const { email_address, password } = req.body;

        const AdminExist = await Admin.findOne({ email_address: email_address })

        if (!AdminExist) {
            res.send({ error: `There's no Enrollge Account with the info you provided.` });
        }

        const isMatch = await bcrypt.compare(password, AdminExist.password);

        const token = await AdminExist.generateAuthToken();

        if (!isMatch) {
            res.send({ error: 'Please enter correct email address and password.' })
        } else {
            res.status(201).send({ "Login": 'OK', "Token": token });
        }

    } catch (e) {
        res.status(422).send({ error: e });
    }
})

// Handle Post Request, For Changing Password of Admin Panel's Account
router.post('/admin/account/resetpassword', async (req, res) => {
    try {
        const email_address = req.query.gmail
        const { Password, CPassword } = req.body
        if (Password === CPassword) {
            const HashPassword = await bcrypt.hash(Password, 12);
            const HashCPassword = await bcrypt.hash(CPassword, 12);
            await Admin.findOneAndUpdate({ email_address: new RegExp(email_address, 'i') }, { Password: HashPassword, CPassword: HashCPassword }, { new: true });
            res.status(200).send({ PasswordChange: 'OK' });
        } else {
            res.status(422).send({ error: "Please enter the same password" });
        }
    } catch (error) {
        res.status(401).send({ error: error });
    }
})

// Handle POST Request, to get last element (Token) of array
router.post('/admin/account/token/:email', async (req, res) => {
    try {
        const email = req.params.email
        const token = await Admin.find({ email_address: email }, { 'tokens': { $slice: -1 } })
        res.send(token)
    } catch (e) {
        res.send({ error: e })
    }

})

module.exports = router;