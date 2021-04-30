const express = require("express");
const router = new express.Router();
const Subjects = require("../models/subjects");

// Here, First Handle the Add Subjects API
router.post("/subjects", async (req, res) => {
    try {
        const AddSubject = new Subjects(req.body)
        await AddSubject.save();
        res.send(true);
    } catch (e) {
        res.send(false);
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
        await Subjects.findByIdAndUpdate({ _id: _id }, req.body, { new: true })
        res.send(true);
    } catch (e) {
        res.send(false);
    }
})

// Here, We Handle Patch Request For Update Chapter of Subject Details
router.patch("/subjects/chapters/:ids/:idc", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idc = req.params.idc
        await Subjects.updateOne({ _id: _ids, "Chapters._id": _idc }, { $set: req.body }, { new: true })
        res.send(true);
    } catch (e) {
        res.send(false);
    }
})

// Here, We Handle Patch Request For Update Topics of Chapter of Subject Details
router.patch("/subjects/chapters/topics/:ids/:idc/:topicindex", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idc = req.params.idc
        const topicindex = req.params.topicindex
        const updateTopic = `Chapters.$.Topics.${topicindex}` // !Important How To Pass const values in (query,update, options) of mongodb
        await Subjects.updateOne({ _id: _ids, "Chapters._id": _idc }, { $set: { [`${updateTopic}`]: req.body } }, { new: true }) // Use const or external object or variable in mongo using array [] and then backlits[`${external object or value}`] to enter external object or value
        res.send(true);
    } catch (e) {
        res.send(false);
    }
})

// Here We Will Handle the Put Request For Adding Chapter in Subjects
router.put("/subjects/chapters/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await Subjects.updateOne({ _id: _id }, { $push: { 'Chapters': req.body } }, { new: true })
        res.send(true);
    } catch (e) {
        res.send(false);
    }
})

// Here We Will Handle the Put Request For Adding Topics in Subjects of Chapter
router.put("/subjects/chapters/topics/:ids/:idc", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idc = req.params.idc
        // Here First We Have to Find the Object by id And Then Find The Array Of Object With that Id And Push it Using Push Method
        const AddTopics = await Subjects.update({ _id: _ids, "Chapters._id": _idc }, { $push: { "Chapters.$.Topics": req.body } }, { new: true })
        res.send(AddTopics);
    } catch (e) {
        res.status(402).send(e);
    }
})

// Now, We Handle Delete Request
router.delete("/subject/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await Subjects.findByIdAndDelete({ _id: _id })
        res.send(true);
    } catch (e) {
        res.status(500).send(e);
    }
})

// Now We Handle Get Request For Individuals Subjects And Chapters
router.get("/subject/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const ShowSubject = await Subjects.find({ _id: _id })
        res.send(ShowSubject);
    } catch (e) {
        res.send(e);
    }
})

// Now We Handle Get Request For Individuals Subjects And Chapters
router.get("/subject/chapter/:ids/:idc", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idc = req.params.idc
        const ShowChapter = await Subjects.find({ _id: _ids, "Chapters._id": _idc })
        res.send(ShowChapter);
    } catch (e) {
        res.send(e);
    }
})

// Here We Handle Get Request For Search Subject By Name
router.get("/subjects/:subname", async (req, res) => {
    try {
        const subname = req.params.subname
        const ShowSubjects = await Subjects.findOne({ Subject_Name: subname })
        res.send(ShowSubjects);
    } catch (e) {
        res.send("nhi huva")
    }
})

// Here We Handle Delete Request for Deleting Chapter
router.delete("/subjects/chapters/:ids/:idc", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idc = req.params.idc
        await Subjects.update({ _id: _ids }, { $pull: { "Chapters": { "_id": _idc } } }, { new: true })
        res.send(true);
    } catch (e) {
        res.send(false)
    }
})

// Here We Handle Delete Request for Deleting Topic
router.delete("/subjects/chapters/topics/:ids/:idc/:idt", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idc = req.params.idc
        const _idt = req.params.idt
        await Subjects.update({ "_id": _ids, "Chapters._id": _idc }, { $pull: { "Chapters.$.Topics": { "_id": _idt } } }, { new: true });
        res.send(true)
    } catch (e) {
        res.send(false);
    }
})

// Here Now We Make Api For Mobile Enrollge App
router.post("/subjects/:course/:branch/:semester", async (req, res) => {
    try {
        const course = req.params.course
        const branch = req.params.branch
        const semester = req.params.semester
        const SelectedSubject = await Subjects.find({ Subject_Course: course, Subject_Branch: branch, Subject_Semester: semester })
        res.json(SelectedSubject);
    } catch (e) {
        res.status(402).json(e)
    }
});

// API to Get Only Chapters
router.post("/subjects/chapters/:course/:branch/:semester", async (req, res) => {
    try {
        const course = req.params.course
        const branch = req.params.branch
        const semester = req.params.semester
        const SelectedSubject = await Subjects.find({ Subject_Course: course, Subject_Branch: branch, Subject_Semester: semester }).select('Chapters Subject_Name')
        res.send(SelectedSubject);
    } catch (e) {
        res.status(402).json(e)
    }
});

module.exports = router