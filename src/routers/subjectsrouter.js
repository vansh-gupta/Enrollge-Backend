const express = require("express");
const router = new express.Router();
const Subjects = require("../models/subjects");

// Here, First Handle the Add Subjects API
router.post("/subjects", async (req, res) => {
    try {
        const AddSubject = new Subjects(req.body)
        await AddSubject.save();
        res.send("Successfully Added");
    } catch (e) {
        res.status(402).send(e);
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


// Here We Will Handle the Put Request For Adding Chapter in Subjects
router.put("/subjects/chapters/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const AddChapter = await Subjects.updateOne({ _id: _id }, { $push: { 'Chapters' : req.body} }, { new: true })
        res.send(AddChapter);
    } catch (e) {
        res.status(500).send(e);
    }
})
// Here We Will Handle the Put Request For Adding Topics in Subjects of Chapter
router.put("/subjects/chapters/topics/:ids/:idc", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idc = req.params.idc
        // Here First We Have to Find the Object by id And Then Find The Array Of Object With that Id And Push it Using Push Method
        const AddTopics = await Subjects.update({ _id:_ids , "Chapters._id": _idc }, { $push: {"Chapters.$.Topics": req.body} }, { new: true })
        res.send(AddTopics);
    } catch (e) {
        res.status(402).send(e);
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