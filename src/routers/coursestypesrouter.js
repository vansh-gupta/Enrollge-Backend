const express = require('express')
const router = express.Router();
const CoursesTypes = require('../models/coursestypes');

// API For Adding the Courses Types
router.post("/coursetype", async (req, res) => {
    try {
        const AddCourseType = new CoursesTypes(req.body)
        await AddCourseType.save();
        res.status(201).send(true);
    } catch (e) {
        res.status(400).send(false);
    }
})

//API to Get the Courses Type and Descriptons
router.get("/coursestypes", async (req, res) => {
    try {
        const ShowCoursesTypes = await CoursesTypes.find({})
        res.status(200).send(ShowCoursesTypes);
    } catch (e) {
        res.status(400).send(e)
    }
})

// API to delete the Courses Type 
router.delete("/coursetype/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await CoursesTypes.findByIdAndDelete({ _id: _id })
        res.status(202).send(true);
    } catch (e) {
        res.status(400).send(false)
    }
})

// API to Update the Courses Type
router.patch("/coursetype/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await CoursesTypes.updateOne({ _id: _id }, req.body, { new: true });
        res.status(200).send(true);
    } catch (e) {
        res.status(400).send(false)
    }
})


module.exports = router