const express = require('express');
const router = new express.Router();
const CoursesCategories = require("../models/coursescategories");


// API to Add the Categories of Courses
router.post('/coursecategory', async (req, res) => {
    try {
        const AddCourseCategory = new CoursesCategories(req.body)
        await AddCourseCategory.save()
        res.status(201).send(true);
    } catch (e) {
        res.status(402).send(false)
    }
})

// API to Get All Categories of Courses
router.get("/coursescategories", async (req, res) => {
    try {
        const ShowCoursesCategories = await CoursesCategories.find({});
        res.status(200).send(ShowCoursesCategories);
    } catch (err) {
        res.status(402).json(e);
    }
})

//   API To Delete Courses Category
router.delete('/coursecategory/:id', async (req, res) => {
    try {
        const _id = req.params.id
        await CoursesCategories.findByIdAndDelete({ _id: _id });
        res.status(202).json(true);
    } catch (error) {
        res.status(402).json(false);
    }
})

//  API to update the Course Category
router.patch('/coursecategory/:id', async (req, res) => {
    try {
        const _id = req.params.id
        await CoursesCategories.updateOne({ _id: _id }, req.body, { new: true });
        res.status(200).send(true);
    } catch (error) {
        res.status(402).json(false);
    }
})

module.exports = router