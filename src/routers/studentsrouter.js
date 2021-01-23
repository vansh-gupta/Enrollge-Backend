const express = require("express");
const router = new express.Router();
const Students = require("../models/students");

// To Check the Get Method
router.get("/", async (req, res) => {
    res.send("Hello World")
})

// Here We Will Handle Post Request (To Create)
router.post("/students", async (req, res) => {
    try {
        const AddStudent = new Students(req.body)
        console.log(req.body);
        const insertStudent = await AddStudent.save();
        res.status(201).send(insertStudent);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Now, We handle Get Request (To Get Data)
router.get("/students", async (req, res) => {
    try {
        const GetStudents = await Students.find({}).sort({ "Semester": -1 })
        res.send(GetStudents);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Now, We handle Get Request for Individuals
router.get("/students/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const GetStudent = await Students.findById({ _id: _id });
        res.send(GetStudent);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Now, We Handle Patch Request (Change Only One Thing Not Whole thing)
router.patch("/students/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const UpdateStudent = await Students.findByIdAndUpdate({ _id: _id }, req.body, { new: true })
        res.send(UpdateStudent);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Now, We Handle Delete Request (for Deleting the Documents)
router.delete("/students/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const DeleteStudent = await Students.findByIdAndDelete(_id);
        res.send(DeleteStudent);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;

