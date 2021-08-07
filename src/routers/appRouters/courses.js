const express = require("express");
const router = new express.Router();
const Courses = require("../../models/courses");

// Handle GET Request, For Getting Courses on Basis of Course Type
router.get("/app/courses/:coursetype", async (req, res) => {
    try {
        const coursetype = req.params.coursetype
        const SelectedCourses = await Courses.find({ Courses_Type: coursetype });
        res.send(SelectedCourses);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;