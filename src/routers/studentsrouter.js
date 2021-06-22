const express = require("express");
const router = new express.Router();
const Students = require("../models/students");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const EmailValidator = require('email-deep-validator');

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
});

// Now We Handle Post Request For Changing Password of Students Account
router.post('/students/resetpassword', async (req, res) => {
    try {
        const Mobile_No = req.query.studentnumber
        const { Password, CPassword } = req.body
        if (Password === CPassword) {
            const HashPassword = await bcrypt.hash(Password, 12);
            const HashCPassword = await bcrypt.hash(CPassword, 12);
            await Students.findOneAndUpdate({ Mobile_No: new RegExp(Mobile_No, 'i') }, { Password: HashPassword, CPassword: HashCPassword }, { new: true });
            res.status(200).json({ PasswordChange: true });
        } else {
            res.status(422).json("Please Enter the Same Password");
        }
    } catch (error) {
        res.status(401).json({ PasswordChange: false });
    }
});


// Now, We handle Get Request (To Get Data)
router.get("/students", async (req, res) => {
    try {
        const ShowAllStudents = await Students.find({}).sort({ _id: 1 });
        res.send(ShowAllStudents);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Now, We handle Get Request (To Get Data of Students By Name)
router.get("/students/name/:studentname", async (req, res) => {
    try {
        const studentname = req.params.studentname
        const ShowByStudentName = await Students.find({ Full_Name: new RegExp(studentname, 'i') }).sort({ _id: 1 });
        res.send(ShowByStudentName);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Now, We handle Get Request (To Get Data of Students By Number)
router.get("/students/number/:studentnumber", async (req, res) => {
    try {
        const studentnumber = req.params.studentnumber
        const ShowByStudentNumber = await Students.find({ Mobile_No: new RegExp(studentnumber, 'i') }).sort({ _id: 1 });
        res.send(ShowByStudentNumber);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Now, We handle Get Request (To Get Data of Students By Email)
router.get("/students/email/:studentemail", async (req, res) => {
    try {
        const studentemail = req.params.studentemail
        const ShowByStudentEmail = await Students.find({ Gmail_Id: new RegExp(studentemail, 'i') }).sort({ _id: 1 });
        res.send(ShowByStudentEmail);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Now, We handle Get Request (To Get Data of Students By Course)
router.get("/students/course/:studentcourse", async (req, res) => {
    try {
        const studentcourse = req.params.studentcourse
        const ShowByStudentCourse = await Students.find({ Course: new RegExp(studentcourse, 'i') }).sort({ _id: 1 });
        res.send(ShowByStudentCourse);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Now, We handle Get Request (To Get Data of Students By Branch)
router.get("/students/branch/:studentbranch", async (req, res) => {
    try {
        const studentbranch = req.params.studentbranch
        const ShowByStudentBranch = await Students.find({ Branch: new RegExp(studentbranch, 'i') }).sort({ _id: 1 });
        res.send(ShowByStudentBranch);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Now, We handle Get Request (To Get Data of Students By Year)
router.get("/students/year/:studentyear", async (req, res) => {
    try {
        const studentyear = req.params.studentyear
        const ShowByStudentYear = await Students.find({ Year: { $in: studentyear } }).sort({ _id: 1 });
        res.send(ShowByStudentYear);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Now, We handle Get Request (To Get Data of Students By University)
router.get("/students/university/:studentuniversity", async (req, res) => {
    try {
        const studentuniversity = req.params.studentuniversity
        const ShowByStudentUniversity = await Students.find({ University_Name: new RegExp(studentuniversity, 'i') }).sort({ _id: 1 });
        res.send(ShowByStudentUniversity);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Now, We Handle API For Email Address, Verify email address checking MX records, and SMTP connection.
router.get('/students/checkemail', async (req, res) => {
    try {
        const email = req.query.email
        const emailValidator = new EmailValidator();
        const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(email);
        res.json({ wellFormed: wellFormed, validDomain: validDomain, validMailbox: validMailbox })
    } catch (error) {
        res.status(400).json({ error: false });
    }
})

// Now, here We handle API For Email Checking That its Already Exits ?
router.get('/students/checkgmail', async (req, res) => {
    try {
        const gmail = req.query.gmail
        const CheckEmail = await Students.find({ Gmail_Id: gmail }).countDocuments();
        if (CheckEmail === 1) {
            res.json({ EmailExist: true });
        }
        if (CheckEmail === 0) {
            res.json({ EmailExist: false });
        }
    } catch (error) {
        res.status(400).json({ error: false });
    }
});

// Now, here We handle API For Mobile Number Checking That its Already Exits ?
router.get('/students/checknumber', async (req, res) => {
    try {
        const number = req.query.number
        const CheckNumber = await Students.find({ Mobile_No: new RegExp(number, 'i') }).countDocuments()
        if (CheckNumber === 1) {
            res.json({ NumberExist: true })
        }
        if (CheckNumber === 0) {
            res.json({ NumberExist: false })
        }
    } catch (error) {
        res.status(400).json({ error: false });
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
        await Students.findByIdAndDelete(_id);
        res.send(true);
    } catch (e) {
        res.status(500).send(false);
    }
});

module.exports = router;

