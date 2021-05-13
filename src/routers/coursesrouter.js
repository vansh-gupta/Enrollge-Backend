const express = require("express");
const router = new express.Router();
const Courses = require("../models/courses");

// Here We Will Handle Post Request to Create Coureses with Topics
router.post("/courses", async (req, res) => {
    try {
        const AddCourses = new Courses(req.body);
        await AddCourses.save();
        res.status(200).send(true);
    } catch (e) {
        res.status(400).send(false)
    }
})

//Here We Handle Add Topics in Courses
router.put("/courses/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        const AddCoursesTopic = await Courses.updateOne({ _id: _id }, { $push: { 'Courses_Topics': req.body } }, { new: true })
        res.send(AddCoursesTopic);
    } catch (e) {
        res.status(401).send(e);
    }
})

// Here We Will Handle Get Request to Get Coureses with Topics
router.get("/courses", async (req, res) => {
    try {
        const ShowCourses = await Courses.find({}).sort({ Courses_Order: 1 });
        res.send(ShowCourses);
    } catch (e) {
        res.send(e)
    }
})

// Here We Will Handle Get Request to For Searching Courses
router.get("/course", async (req, res) => {
    try {
        const coursetype = req.query.coursetype
        const coursename = req.query.coursename
        const ShowByCourseType = await Courses.find({ Courses_Type: new RegExp(coursetype, 'i') }).sort({ Courses_Order: 1 }).collation({ locale: "en_US", numericOrdering: true })
        const ShowByCourseName = await Courses.find({ Courses_Name: new RegExp(coursename, 'i') }).sort({ Courses_Order: 1 }).collation({ locale: "en_US", numericOrdering: true })
        const ShowAllCourses = await Courses.find({}).sort({ Courses_Order: 1 });
        const Course = {}
        Course.ShowAllCourses = ShowAllCourses
        Course.ShowByCourseName = ShowByCourseName
        Course.ShowByCourseType = ShowByCourseType
        res.send(Course);
    } catch (e) {
        res.send(e)
    }
})

// Here We Will Handle Get Request to Get Courese (Search by Id) with Topics
router.get("/courses/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const ShowCourse = await Courses.findById(_id);
        res.send(ShowCourse);
    } catch (e) {
        res.send(e);
    }
})

// Here We Will Handle Delete Request to Delete Courses with Topics
router.delete("/courses/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await Courses.findByIdAndDelete(_id);
        res.send(true);
    } catch (e) {
        res.send(false);
    }
})

// Here We Will Handle Delete Request to Delete Topics of Courses
router.delete("/courses/topics/:idc/:idt", async (req, res) => {
    try {
        const _idc = req.params.idc
        const _idt = req.params.idt
        await Courses.update({ _id: _idc }, { $pull: { "Courses_Topics": { "_id": _idt } } }, { new: true });
        res.send(true);
    } catch (e) {
        res.send(false);
    }
})

// Here We Will Handle the Put Request For Adding Topics of Courses
router.put("/courses/topics/:id", async (req, res) => {
    try {
        const _id = req.params.id
        // Here First We Have to Find the Object by id And Then Find The Array Of Object With that Id And Push it Using Push Method
        const AddTopics = await Courses.update({ _id: _id }, { $push: { "Courses_Topics": req.body } }, { new: true })
        res.send(AddTopics);
    } catch (e) {
        res.status(402).send(e);
    }
})

// Here We Will Handle Patch Request to Update Coureses
router.patch("/courses/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const UpdateCourses = await Courses.findByIdAndUpdate(_id, req.body, { new: true });
        res.send(UpdateCourses);
    } catch (e) {
        res.send(e);
    }
})
// Here We Will Handle Patch Request to Update Topics of Courses
router.patch("/courses/topics/:idc/:idt", async (req, res) => {
    try {
        const _idc = req.params.idc
        const _idt = req.params.idt
        const UpdateCourses = await Courses.updateOne({ _id: _idc, 'Courses_Topics._id': _idt }, { $set: { 'Courses_Topics.$': req.body } })
        res.send(UpdateCourses);
    } catch (e) {
        res.send(e);
    }
})

// API For App 

// API to Get Courses on Basis of Course Type
router.post("/courses/:coursetype", async (req, res) => {
    try {
        const coursetype = req.params.coursetype
        const SelectedCourses = await Courses.find({ Courses_Type: coursetype });
        res.send(SelectedCourses);
    } catch (e) {
        res.status(400).send(e);
    }
})

module.exports = router;
