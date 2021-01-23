const express = require("express");
const router = new express.Router();
const ExtraCourses = require("../models/extracourses");

// Here We Will Handle Post Request to Create ExtraCoureses with Topics
router.post("/extracourses", async (req, res) => {
    try {
        const AddExtraCourses = new ExtraCourses(req.body);
        const insertExtraCourses = await AddExtraCourses.save();
        res.status(200).send(insertExtraCourses);
    } catch (e) {
        res.status(400).send(e)
    }
})

// Here We Will Handle Get Request to Get ExtraCoureses with Topics
router.get("/extracourses", async (req, res) => {
    try {
        const ShowExtraCourses = await ExtraCourses.find({}).sort({ ExtraCourses_Order: 1 });
        res.send(ShowExtraCourses);
    } catch (e) {
        res.send(e)
    }
})

// Here We Will Handle Get Request to Get ExtraCourese (Search by Id) with Topics
router.get("/extracourses/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const ShowExtraCourse = await ExtraCourses.findById(_id);
        res.send(ShowExtraCourse);
    } catch (e) {
        res.send("Nhi");
    }
})

// Here We Will Handle Delete Request to Delete ExtraCourese with Topics
router.delete("/extracourses/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const DeleteExtraCourse = await ExtraCourses.findByIdAndDelete(_id);
        res.send(DeleteExtraCourse);
    } catch (e) {
        res.send(e);
    }
})

// Here We Will Handle Patch Request to Update ExtraCourese with Topics
router.patch("/extracourses/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const UpdateExtraCourses = await ExtraCourses.findByIdAndUpdate(_id, req.body, { new: true });
        res.send(UpdateExtraCourses);
    } catch (e) {
        res.send(e);
    }
})


module.exports = router;
