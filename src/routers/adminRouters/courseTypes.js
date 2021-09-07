const express = require('express')
const router = express.Router();
const CoursesTypes = require('../../models/coursestypes');

// Handle POST Request, For Adding the Courses Types
router.post("/admin/courses/coursetype/add", async (req, res) => {
    try {
        const AddCourseType = new CoursesTypes(req.body)
        await AddCourseType.save();
        res.status(201).send({ CourseTypeAdded: true });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
})

// Handle GET Request, For Getting Courses Types Name And Its Published Status
router.get("/admin/coursestypes/names/status", async (req, res) => {
    try {
        const ShowCoursesTypes = await CoursesTypes.find({}).select('Course_Type Course_TypePublished');
        res.status(200).send(ShowCoursesTypes);
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

// Handle GET Request, For Getting Courses Types
router.get("/admin/coursestypes", async (req, res) => {
    try {
        const ShowCoursesTypes = await CoursesTypes.find({})
        res.status(200).send(ShowCoursesTypes);
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

// Handle Delete Request, For Deleting the Courses Type 
router.delete("/admin/coursetype/delete/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await CoursesTypes.findByIdAndDelete({ _id: _id })
        res.status(202).send({ CourseTypeDeleted: true });
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

// Handle PATCH Request, For Updating the Courses Types Data
router.patch("/admin/coursetype/update/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await CoursesTypes.updateOne({ _id: _id }, req.body, { new: true });
        res.status(200).send({ CourseTypeUpdated: true });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
})

module.exports = router