const express = require('express');
const router = new express.Router();
const University = require("../../models/university");


// Handle POST Request, For Adding University
router.post('/admin/university/add', async (req, res) => {
    try {
        const AddUniversity = new University(req.body)
        await AddUniversity.save()
        res.status(201).send({ UniversityAdded: true });
    } catch (e) {
        res.status(402).send({ error: e.message });
    }
})

// Handle GET Request, For Getting All Universities Name And Status
router.get("/admin/universities", async (req, res) => {
    try {
        const ShowUniversities = await University.find({}).select('University_Name University_Published');
        res.status(200).send(ShowUniversities);
    } catch (e) {
        res.status(402).json({ error: e.message });
    }
})

// Handle GET Request, For Getting All Universities, Courses, Branches And Year Data
router.get("/admin/universities/courses", async (req, res) => {
    try {
        const UniversitiesCourses = await University.find({}).select('University_Name University_Published University_Courses');
        res.status(200).send(UniversitiesCourses);
    } catch (e) {
        res.status(402).json({ error: e.message });
    }
})

// Handle Delete Request, For Deleting University Data
router.delete('/admin/university/delete/:id', async (req, res) => {
    try {
        const _id = req.params.id
        await University.findByIdAndDelete({ _id: _id });
        res.status(202).json({ UniversityDeleted: true });
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
})

// Handle PATCH Request, For Updating the University
router.patch('/admin/university/update/:id', async (req, res) => {
    try {
        const _id = req.params.id
        await University.updateOne({ _id: _id }, req.body, { new: true });
        res.status(200).send({ UniversityUpdated: true });
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
});

// Handle PUT Request, For Adding Course in the University
router.put('/admin/university/course/add/:id', async (req, res) => {
    try {
        const _id = req.params.id
        await University.updateOne({ _id: _id }, { $push: { 'University_Courses': req.body } }, { new: true });
        res.status(200).send({ CourseAdded: true });
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
})

// Handle Delete Request, For Deleting Course of the University
router.delete("/admin/university/course/delete/:idu/:idc", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        await University.updateOne({ _id: _idu }, { $pull: { "University_Courses": { "_id": _idc } } }, { new: true })
        res.send({ CourseDeleted: true });
    } catch (e) {
        res.send({ error: e.message })
    }
})

// Handle Patch Request, For Update Course of University
router.patch("/admin/university/course/update/:idu/:idc", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        await University.updateOne({ _id: _idu, "University_Courses._id": _idc }, { $set: req.body }, { new: true })
        res.send({ CourseUpdated: true });
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Get Request, For Getting of Courses of University
router.get("/admin/university/courses/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const ShowCourses = await University.find({ _id: _id }).select('University_Courses')
        res.send(ShowCourses);
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle PUT Request, For Adding Branch in Course of University
router.put("/admin/university/course/branch/add/:idu/:idc", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        // Here First We Have to Find the Object by id And Then Find The Array Of Object With that Id And Push it Using Push Method
        await University.updateOne({ _id: _idu, "University_Courses._id": _idc }, { $push: { "University_Courses.$.Course_Branches": req.body } }, { new: true })
        res.send({ BranchAdded: 'OK' });
    } catch (e) {
        res.status(402).send({ error: e.message });
    }
})

// Handle PUT Request, For Adding Year in Course of University
router.put("/admin/university/course/year/add/:idu/:idc", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        // Here First We Have to Find the Object by id And Then Find The Array Of Object With that Id And Push it Using Push Method
        await University.updateOne({ _id: _idu, "University_Courses._id": _idc }, { $push: { "University_Courses.$.Course_Years": req.body } }, { new: true })
        res.send({ YearAdded: 'OK' });
    } catch (e) {
        res.status(402).send({ error: e.message });
    }
})

// Handle Patch Request, For Update Branch in Course of University
router.patch("/admin/university/course/branch/update/:idu/:idc/:branchindex", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        const branchindex = req.params.branchindex
        const updateBranch = `University_Courses.$.Course_Branches.${branchindex}` // !Important How To Pass const values in (query,update, options) of mongodb
        await University.updateOne({ _id: _idu, "University_Courses._id": _idc }, { $set: { [`${updateBranch}`]: req.body } }, { new: true }) // Use const or external object or variable in mongo using array [] and then backlits[`${external object or value}`] to enter external object or value
        res.send({ BranchUpdated: true });
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Patch Request, For Update Year in Course of University
router.patch("/admin/university/course/year/update/:idu/:idc/:yearindex", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        const yearindex = req.params.yearindex
        const updateYear = `University_Courses.$.Course_Years.${yearindex}` // !Important How To Pass const values in (query,update, options) of mongodb
        await University.updateOne({ _id: _idu, "University_Courses._id": _idc }, { $set: { [`${updateYear}`]: req.body } }, { new: true }) // Use const or external object or variable in mongo using array [] and then backlits[`${external object or value}`] to enter external object or value
        res.send({ YearUpdated: true });
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Delete Request, For Deleting Branch in Course of University
router.delete("/admin/university/course/branch/delete/:idu/:idc/:idb", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        const _idb = req.params.idb
        await University.updateOne({ "_id": _idu, "University_Courses._id": _idc }, { $pull: { "University_Courses.$.Course_Branches": { "_id": _idb } } }, { new: true });
        res.send({ BranchDeleted: true })
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Delete Request, For Deleting Year in Course of University
router.delete("/admin/university/course/year/delete/:idu/:idc/:idy", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        const _idy = req.params.idy
        await University.updateOne({ "_id": _idu, "University_Courses._id": _idc }, { $pull: { "University_Courses.$.Course_Years": { "_id": _idy } } }, { new: true });
        res.send({ YearDeleted: true })
    } catch (e) {
        res.send({ error: e.message });
    }
})

module.exports = router