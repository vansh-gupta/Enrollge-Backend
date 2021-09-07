const express = require("express");
const router = new express.Router();
const Courses = require("../../models/courses");

// Handle Post Request, to Add Course
router.post("/admin/course/add", async (req, res) => {
    try {
        const AddCourses = new Courses(req.body);
        await AddCourses.save();
        res.status(200).send({ CourseAdded: true });
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

// Handle PUT Request, For Adding Topic of Course
router.put("/admin/course/topic/add/:id", async (req, res) => {
    try {
        const _id = req.params.id
        // Here First We Have to Find the Object by id And Then Find The Array Of Object With that Id And Push it Using Push Method
        await Courses.update({ _id: _id }, { $push: { "Courses_Topics": req.body } }, { new: true })
        res.send({ CourseTopicAdded: 'OK' });
    } catch (e) {
        res.status(402).send({ error: e.message });
    }
})

// Handle Get Request, to Get Courses Data
router.get("/admin/courses", async (req, res) => {
    try {
        const ShowCourses = await Courses.find({}).select('Course_Published Courses_Name Courses_Order Courses_Type Courses_ImgUrl Courses_Description').sort({ Courses_Order: 1 });
        res.send(ShowCourses);
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Get Request, For Searching Courses By CourseType
router.get("/admin/courses/coursetype/:coursetype", async (req, res) => {
    try {
        const coursetype = req.params.coursetype
        const ShowByCourseType = await Courses.find({ Courses_Type: coursetype }).select('Course_Published Courses_Name Courses_Order Courses_Type Courses_ImgUrl Courses_Description').sort({ Courses_Order: 1 }).collation({ locale: "en_US", numericOrdering: true });
        res.send(ShowByCourseType);
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Get Request, For Searching Courses By Course Name
router.get("/admin/courses/coursename/:coursename", async (req, res) => {
    try {
        const coursename = req.params.coursename
        const ShowByCourseName = await Courses.find({ Courses_Name: coursename }).select('Course_Published Courses_Name Courses_Order Courses_Type Courses_ImgUrl Courses_Description').sort({ Courses_Order: 1 }).collation({ locale: "en_US", numericOrdering: true });
        res.send(ShowByCourseName);
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Get Request, to Get All Topics of Course
router.get("/admin/course/topics/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const ShowCourseTopics = await Courses.findById(_id).select('Courses_Topics');
        res.send(ShowCourseTopics);
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Delete Request, to Delete Course with their Topics
router.delete("/admin/course/delete/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await Courses.findByIdAndDelete(_id);
        res.send({ CourseDeleted: true });
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Delete Request, to Delete Topic of Course
router.delete("/admin/course/topic/delete/:idc/:idt", async (req, res) => {
    try {
        const _idc = req.params.idc
        const _idt = req.params.idt
        await Courses.update({ _id: _idc }, { $pull: { "Courses_Topics": { "_id": _idt } } }, { new: true });
        res.send({ TopicDeleted: true });
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Patch Request, to Update Courese
router.patch("/admin/course/update/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await Courses.findByIdAndUpdate(_id, req.body, { new: true });
        res.send({ updateCourse: 'OK' });
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Patch Request, to Update Topic of Courses
router.patch("/admin/courses/topic/update/:idc/:idt", async (req, res) => {
    try {
        const _idc = req.params.idc
        const _idt = req.params.idt
        await Courses.updateOne({ _id: _idc, 'Courses_Topics._id': _idt }, { $set: { 'Courses_Topics.$': req.body } })
        res.send({ updateCourseTopic: 'OK' });
    } catch (e) {
        res.send({ error: e.message });
    }
})

module.exports = router;
