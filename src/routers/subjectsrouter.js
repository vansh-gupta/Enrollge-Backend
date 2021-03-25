const express = require("express");
const router = new express.Router();
const Subjects = require("../models/subjects");

// Here, First Handle the Add Subjects API
router.post("/subjects", async (req, res) => {
    try {
        const AddSubject = new Subjects(req.body)
        const insertSubject = await AddSubject.save();
        res.send(insertSubject);
    } catch (e) {
        res.status(400).send(e);
    }
})

// Here, We Handle Get Request
router.get("/subjects", async (req, res) => {
    try {
        const ShowSubjects = await Subjects.find({});
        res.send(ShowSubjects);
    } catch (e) {
        res.status(400).send(e);
    }
})

// Here, We Handle Patch Request For Update Subject Details
router.patch("/subjects/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const UpdateSubject = await Subjects.findByIdAndUpdate({ _id: _id }, req.body, { new: true })
        res.send(UpdateSubject);
    } catch (e) {
        res.status(500).send(e);
    }
})


// Here We Will Handle the Put Request For Adding Chapter And Topics in Subjects
router.put("/subjects/chapters/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const AddChapterTopics = await Subjects.updateOne({ _id: _id }, { $push: req.body }, { new: true })
        res.send(AddChapterTopics);
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
})

// Now, We Handle Delete Request
router.delete("/subjects/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const DeleteSubject = await Subjects.findByIdAndDelete({ _id: _id })
        res.send(DeleteSubject);
    } catch (e) {
        res.status(500).send(e);
    }
})

// Now We Handle Get Request For Individuals Subjects
router.get("/subjects/:subjectName", async (req, res) => {
    try {
        const subjectName = req.params.subjectName
        const ShowSubject = await Subjects.find({ Subject_Name: subjectName })
        res.send(ShowSubject);
    } catch (e) {
        res.send(400).send(e);
    }
})

module.exports = router