const express = require("express");
const router = new express.Router();
const Subjects = require("../../models/subjects");

// Handle GET Request, For Getting Subjects According to the University, Course, Branch And Year
router.get("/app/subjects/:university/:course/:branch/:year", async (req, res) => {
    try {
        const course = req.params.course
        const university = req.params.university
        const branch = req.params.branch
        const year = req.params.year
        const SelectedSubject = await Subjects.find({
            $and: [
                { Subject_Branch: { $in: branch } },
                { Subject_University: university },
                { Subject_Course: course },
                { Subject_Year: year }
            ]
        }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published Chapters');
        res.json(SelectedSubject);
    } catch (e) {
        res.status(402).json(e)
    }
});


// Handle GET Request, For Getting Subjects of Syllabus According to the University, Course, Branch And Year
router.get("/app/subjects/syllabus/:university/:course/:branch/:year", async (req, res) => {
    try {
        const course = req.params.course
        const university = req.params.university
        const branch = req.params.branch
        const year = req.params.year
        const SelectedSubjectSyllabus = await Subjects.find({
            $and: [
                { Subject_Branch: { $in: branch } },
                { Subject_University: university },
                { Subject_Course: course },
                { Subject_Year: year }
            ]
        }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Syllabus Subject_Name');
        res.json(SelectedSubjectSyllabus);
    } catch (e) {
        res.status(402).json(e)
    }
});

// Handle GET Request, For Getting Subjects of Previous Year Question Paper According to the University, Course, Branch And Year
router.get("/app/subjects/pyqps/:university/:course/:branch/:year", async (req, res) => {
    try {
        const course = req.params.course
        const university = req.params.university
        const branch = req.params.branch
        const year = req.params.year
        const SelectedSubjectPYQPs = await Subjects.find({
            $and: [
                { Subject_Branch: { $in: branch } },
                { Subject_University: university },
                { Subject_Course: course },
                { Subject_Year: year }
            ]
        }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_PreviousYearPapers Subject_Name');
        res.json(SelectedSubjectPYQPs);
    } catch (e) {
        res.status(402).json(e)
    }
});

module.exports = router