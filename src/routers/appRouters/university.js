const express = require('express');
const router = new express.Router();
const University = require("../../models/university");

// Handle GET Request, For Getting Published Universities
router.get("/app/universities/published", async (req, res) => {
    try {
        const PublishedUniversities = await University.find({ University_Published: true }).select('University_Name University_Published');
        res.json(PublishedUniversities);
    } catch (e) {
        res.send(e);
    }
})

// Handle GET Request, For Getting Published Courses According to University
router.get("/app/university/:university/courses/published", async (req, res) => {
    try {
        const university = req.params.university
        const selectedUniversity = await University.find({ University_Published: true, University_Name: university }).select('University_Courses University_Name University_Published');
        const courses = await selectedUniversity[0].University_Courses
        const coursesOptions = await courses.filter(value => value.Course_Published === true);
        res.json(coursesOptions);
    } catch (e) {
        res.send(e);
    }
})

// Handle Get Request, For Getting Published Branches According to Courses
router.get("/app/university/:university/course/:course/branches/published", async (req, res) => {
    try {
        const university = req.params.university
        const course = req.params.course
        const selectedUniversity = await University.find({ University_Published: true, University_Name: university }).select('University_Courses University_Name University_Published');
        const courses = await selectedUniversity[0].University_Courses
        const coursesOptions = await courses.filter(courses => courses.Course_Published === true);
        const selectedCourse = await coursesOptions.find(value => value.Course_Name === course)
        const branches = await selectedCourse.Course_Branches
        const branchesOptions = await branches.filter(branches => branches.Branch_Published === true)
        res.json(branchesOptions);
    } catch (e) {
        res.send(e);
    }
})

// Handle Get Request, For Getting Published Years According to Courses
router.get("/app/university/:university/course/:course/years/published", async (req, res) => {
    try {
        const university = req.params.university
        const course = req.params.course
        const selectedUniversity = await University.find({ University_Published: true, University_Name: university }).select('University_Courses University_Name University_Published');
        const courses = await selectedUniversity[0].University_Courses
        const coursesOptions = await courses.filter(courses => courses.Course_Published === true);
        const selectedCourse = await coursesOptions.find(value => value.Course_Name === course)
        const years = await selectedCourse.Course_Years
        const yearsOptions = await years.filter(years => years.Year_Published === true)
        res.json(yearsOptions);
    } catch (e) {
        res.send(e);
    }
})

module.exports = router