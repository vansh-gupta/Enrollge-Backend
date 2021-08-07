const express = require('express');
const router = new express.Router();
const Students = require("../../models/students");
const Subjects = require("../../models/subjects");
const Courses = require("../../models/courses");

// Handling GET Request, For Counting Total Numbers of Documents
router.get('/admin/enrollge/total', async (req, res) => {
    try {
        const NumberOfStudents = await Students.countDocuments();
        const NumberOfSubjects = await Subjects.countDocuments();
        const NumberOfCourses = await Courses.countDocuments();
        const SubjectsData = await Subjects.find({});
        let i;
        let NumberOfChapters = 0;
        for (i = 0; i < NumberOfSubjects; i++) {
            NumberOfChapters += parseInt(JSON.stringify(SubjectsData[i].Chapters.length));
        }
        res.json({ NumberOfStudents, NumberOfSubjects, NumberOfCourses, NumberOfChapters });
    } catch (errror) {
        res.json({ error: error.message });
    }
})

module.exports = router;