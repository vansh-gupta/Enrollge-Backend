const express = require("express");
const router = new express.Router();
const Students = require("../../models/students");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const EmailValidator = require('email-deep-validator');

// Handle Post Request (To Create Or To Register) Students in th App
router.post("/app/student/account/register", async (req, res) => {
    try {
        const { Full_Name, Course, Branch, Year, Gmail_Id, Mobile_No, University_Name, Password, CPassword } = req.body;

        const StudentExist = await Students.findOne({ Gmail_Id: Gmail_Id });

        if (StudentExist) {
            return (res.status(422).json({ error: `An account with Email ${Gmail_Id} already exists.` }));
        }
        if (Password != CPassword) {
            return (res.status(422).json({ error: "Please enter the same password" }))
        }

        const AddStudent = new Students({ Full_Name, Course, Branch, Year, Gmail_Id, Mobile_No, University_Name, Password, CPassword })

        // Here Use Middle Ware of Bcrypt js 
        await AddStudent.save();
        res.status(201).json({ AccountCreated: true });

    } catch (e) {
        res.status(400).json({ error: e.message, AccountCreated: false });
    }
});

// Handle POST Request, For Login Students
router.post("/app/student/account/login", async (req, res) => {
    try {
        const { Gmail_Id, Password } = req.body;

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
        res.status(401).send({ error: e.message });
    }
});

// Handle Post Request, For Changing Password of Student's Account
router.post('/app/students/account/resetpassword', async (req, res) => {
    try {
        const Mobile_No = req.query.studentnumber
        const { Password, CPassword } = req.body
        if (Password === CPassword) {
            const HashPassword = await bcrypt.hash(Password, 12);
            const HashCPassword = await bcrypt.hash(CPassword, 12);
            await Students.findOneAndUpdate({ Mobile_No: new RegExp(Mobile_No, 'i') }, { Password: HashPassword, CPassword: HashCPassword }, { new: true });
            res.status(200).json({ PasswordChange: 'OK' });
        } else {
            res.status(422).json({ error: "Please enter the same password" });
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Handle Patch Request, For Update Students Account's Data From the Database
router.patch("/app/student/account/update/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await Students.findByIdAndUpdate({ _id: _id }, req.body, { new: true })
        res.json({ AccountUpdated: true });
    } catch (e) {
        res.status(500).json({ error: e.message, AccountUpdated: false });
    }
});

// Handle GET Request, For Getting Student's Account Data Using JWT Token
router.get("/app/student/account/:token", async (req, res) => {
    try {
        const token = req.params.token
        const VerifyStudent = jwt.verify(token, process.env.SECRETKEY)
        const GetStudent = await Students.findOne({ _id: VerifyStudent._id }).select('Full_Name Course Branch Year Gmail_Id Mobile_No University_Name');
        res.send(GetStudent);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Handle GET Request, For Checking Email Addrress Exist in Database ( For Checking Account that Already Exist With This Email Addrress ??)
router.get('/app/student/account/checkgmail/:gmail', async (req, res) => {
    try {
        const gmail = req.params.gmail
        const CheckEmail = await Students.find({ Gmail_Id: gmail }).countDocuments();
        if (CheckEmail) {
            res.json({ EmailExist: true });
        } else {
            res.json({ EmailExist: false });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Handle GET Request, For Checking Mobile Number Exist in Database ( For Checking Account that Already Exist With This Mobile Number ??)
router.get('/app/student/account/checknumber/:number', async (req, res) => {
    try {
        const number = req.params.number
        const CheckNumber = await Students.find({ Mobile_No: new RegExp(number, 'i') }).countDocuments();
        if (CheckNumber) {
            res.json({ NumberExist: true });
        } else {
            res.json({ NumberExist: false });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Handle GET Request, For Getting Email Address from Student Mobile Number
router.get('/app/student/account/getemail/:number', async (req, res) => {
    try {
        const number = req.params.number
        const CheckNumber = await Students.find({ Mobile_No: new RegExp(number, 'i') }).select('Gmail_Id');
        const StudentEmailAdrress = await CheckNumber[0].Gmail_Id
        res.json(StudentEmailAdrress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Handle GET Request, For Validating Email Address (Verifying Email Address, Checking MX Records and SMTP Connection)
router.get('/app/email/validate', async (req, res) => {
    try {
        const email = req.query.email
        const emailValidator = new EmailValidator();
        const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(email);
        res.json({ wellFormed: wellFormed, validDomain: validDomain, validMailbox: validMailbox })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})



// (********************************) Handle API For Admin Panel for the Mobile APP (********************************)



// Handle Get Request, For Getting Students Data
router.get("/admin/students", async (req, res) => {
    try {
        const ShowAllStudents = await Students.find({}).select('Full_Name Course Branch Year Gmail_Id Mobile_No University_Name').sort({ _id: 1 });
        res.send(ShowAllStudents);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle Get Request, For Getting Students Data By Students Name
router.get("/admin/students/name/:studentname", async (req, res) => {
    try {
        const studentname = req.params.studentname
        const ShowByStudentName = await Students.find({ Full_Name: new RegExp(studentname, 'i') }).select('Full_Name Course Branch Year Gmail_Id Mobile_No University_Name').sort({ _id: 1 });
        res.send(ShowByStudentName);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle Get Request, For Getting Students Data By Students Number
router.get("/admin/students/number/:studentnumber", async (req, res) => {
    try {
        const studentnumber = req.params.studentnumber
        const ShowByStudentNumber = await Students.find({ Mobile_No: new RegExp(studentnumber, 'i') }).select('Full_Name Course Branch Year Gmail_Id Mobile_No University_Name').sort({ _id: 1 });
        res.send(ShowByStudentNumber);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle Get Request, For Getting Students Data By Students Email
router.get("/admin/students/email/:studentemail", async (req, res) => {
    try {
        const studentemail = req.params.studentemail
        const ShowByStudentEmail = await Students.find({ Gmail_Id: new RegExp(studentemail, 'i') }).select('Full_Name Course Branch Year Gmail_Id Mobile_No University_Name').sort({ _id: 1 });
        res.send(ShowByStudentEmail);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle Get Request, For Getting Students Data By Students Course
router.get("/admin/students/course/:studentcourse", async (req, res) => {
    try {
        const studentcourse = req.params.studentcourse
        const ShowByStudentCourse = await Students.find({ Course: new RegExp(studentcourse, 'i') }).select('Full_Name Course Branch Year Gmail_Id Mobile_No University_Name').sort({ _id: 1 });
        res.send(ShowByStudentCourse);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle Get Request, For Getting Students Data By Students Branch
router.get("/admin/students/branch/:studentbranch", async (req, res) => {
    try {
        const studentbranch = req.params.studentbranch
        const ShowByStudentBranch = await Students.find({ Branch: new RegExp(studentbranch, 'i') }).select('Full_Name Course Branch Year Gmail_Id Mobile_No University_Name').sort({ _id: 1 });
        res.send(ShowByStudentBranch);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle Get Request, For Getting Students Data By Students Year
router.get("/admin/students/year/:studentyear", async (req, res) => {
    try {
        const studentyear = req.params.studentyear
        const ShowByStudentYear = await Students.find({ Year: { $in: studentyear } }).select('Full_Name Course Branch Year Gmail_Id Mobile_No University_Name').sort({ _id: 1 });
        res.send(ShowByStudentYear);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle Get Request, For Getting Students Data By Students University
router.get("/admin/students/university/:studentuniversity", async (req, res) => {
    try {
        const studentuniversity = req.params.studentuniversity
        const ShowByStudentUniversity = await Students.find({ University_Name: new RegExp(studentuniversity, 'i') }).select('Full_Name Course Branch Year Gmail_Id Mobile_No University_Name').sort({ _id: 1 });
        res.send(ShowByStudentUniversity);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle Delete Request, For Deleting the Students Account
router.delete("/admin/students/account/delete/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await Students.findByIdAndDelete(_id);
        res.send({ StudentAccountDeleted: true });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});


module.exports = router;

