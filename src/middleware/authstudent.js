const jwt = require("jsonwebtoken");
const Students = require("../models/students");

const authstudent = async (req, res, next) => {
    try {

        const token = req.cookies.jwtstudent;
        const VerifyStudent = jwt.verify(token, process.env.SECRETKEY)
        console.log(VerifyStudent); // Here We Get ObjectId Of That Student

        const StudentInfo = await Students.findOne({ _id: VerifyStudent._id });
        console.log(StudentInfo.Gmail_Id);
        next();
    } catch (e) {
        res.status(401).send(e);
    }

}

module.exports = authstudent;