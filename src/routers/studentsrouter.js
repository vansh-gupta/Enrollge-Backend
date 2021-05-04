const express = require("express");
const router = new express.Router();
const Students = require("../models/students");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Here We Will Handle Post Request (To Create Or To Register) Students in th App
router.post("/students/register", async (req, res) => {
    try {
        const { Full_Name, Course, Branch, Year, Gmail_Id, Mobile_No, University_Name, Password, CPassword } = req.body;

        if (!Full_Name || !Course || !Branch || !Year || !Gmail_Id || !Mobile_No || !University_Name || !Password || !CPassword) {
            return (res.status(422).json("Please fill the Details Properly"))
        }

        const StudentExist = await Students.findOne({ Gmail_Id: Gmail_Id })

        if (StudentExist) {
            return (res.status(422).json("Email Already Exist"));
        }
        if (Password != CPassword) {
            return (res.status(422).json("Please Enter the Same Password"))
        }

        const AddStudent = new Students({ Full_Name, Course, Branch, Year, Gmail_Id, Mobile_No, University_Name, Password, CPassword })

        // Here Use Middle Ware of Bcrypt js 
        await AddStudent.save();
        res.status(201).json(true)

    } catch (e) {
        res.status(400).send(e);
    }
});

// Now We Handle Post Request For Login Students
router.post("/students/login", async (req, res) => {
    try {
        const { Gmail_Id, Password } = req.body;

        if (!Gmail_Id || !Password) {
            return (res.status(422).json({ error: "Please fill the Details Properly" }));
        }

        const StudentLogin = await Students.findOne({ Gmail_Id: Gmail_Id });
        const isMatch = await bcrypt.compare(Password, StudentLogin.Password);

        if (!isMatch) {
            return (res.status(422).json({ isLogin: false }))
        } else {
            const token = await StudentLogin.generateAuthToken();
            res.cookie("jwtstudent", token);
            return (res.status(200).json({ isLogin: true, token: token }))
        }

    } catch (e) {
        res.status(401).send(e);
    }
})


// Now, We handle Get Request (To Get Data)
router.get("/students", async (req, res) => {
    try {
        const GetStudents = await Students.find({}).sort({ "Year": -1 })
        res.send(GetStudents);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Now, We handle Get Request for Individuals
router.post("/students/:token", async (req, res) => {
    try {
        const token = req.params.token
        const VerifyStudent = jwt.verify(token, process.env.SECRETKEY)
        const GetStudent = await Students.findOne({ _id: VerifyStudent._id }).select('Full_Name Course Branch Year Gmail_Id Mobile_No University_Name');
        res.send(GetStudent);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Now, We Handle Patch Request (Change Only One Thing Not Whole thing)
router.patch("/students/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await Students.findByIdAndUpdate({ _id: _id }, req.body, { new: true })
        res.json(true);
    } catch (e) {
        res.status(500).json(false);
    }
});

// Now, We Handle Delete Request (for Deleting the Documents)
router.delete("/students/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const DeleteStudent = await Students.findByIdAndDelete(_id);
        res.send(DeleteStudent);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;

