const express = require('express');
const router = new express.Router();
const University = require("../models/university");


// API to Add the University
router.post('/university', async (req, res) => {
    try {
        const AddUniversity = new University(req.body)
        await AddUniversity.save()
        res.status(201).send(true);
    } catch (e) {
        res.status(402).send(false);
    }
})

// API to Get All Universities
router.get("/universities", async (req, res) => {
    try {
        const ShowUniversities = await University.find({});
        res.status(200).send(ShowUniversities);
    } catch (err) {
        res.status(402).json(e);
    }
})

// API to Get University By Id
router.get("/university/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const ShowUniversityCourses = await University.find({ _id: _id }).select('University_Published University_Name University_Courses');
        res.status(200).send(ShowUniversityCourses);
    } catch (err) {
        res.status(402).json(err);
    }
})

//   API To Delete University
router.delete('/university/:id', async (req, res) => {
    try {
        const _id = req.params.id
        await University.findByIdAndDelete({ _id: _id });
        res.status(202).json(true);
    } catch (error) {
        res.status(402).json(false);
    }
})

//  API to update the University
router.patch('/university/:id', async (req, res) => {
    try {
        const _id = req.params.id
        await University.updateOne({ _id: _id }, req.body, { new: true });
        res.status(200).send(true);
    } catch (error) {
        res.status(402).json(false);
    }
});

//  API to Add Courses in the University
router.put('/university/:id', async (req, res) => {
    try {
        const _id = req.params.id
        await University.updateOne({ _id: _id }, { $push: { 'University_Courses': req.body } }, { new: true });
        res.status(200).send(true);
    } catch (error) {
        res.status(402).json(false);
    }
})

// Here We Handle Delete Request for Deleting Course
router.delete("/university/course/:idu/:idc", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        await University.updateOne({ _id: _idu }, { $pull: { "University_Courses": { "_id": _idc } } }, { new: true })
        res.send(true);
    } catch (e) {
        res.send(false)
    }
})

// Here, We Handle Patch Request For Update Course of University
router.patch("/university/course/:idu/:idc", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        await University.updateOne({ _id: _idu, "University_Courses._id": _idc }, { $set: req.body }, { new: true })
        res.send(true);
    } catch (e) {
        res.send(false);
    }
})

// Now We Handle Get Request For Branches
router.get("/university/course/:idu/:idc", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        const ShowCourses = await University.find({ _id: _idu, "University_Courses._id": _idc })
        res.send(ShowCourses);
    } catch (e) {
        res.send(e);
    }
})

// Here We Will Handle the Put Request For Adding Branches in Courses of University
router.put("/university/course/branch/:idu/:idc", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        // Here First We Have to Find the Object by id And Then Find The Array Of Object With that Id And Push it Using Push Method
        const AddBranch = await University.updateOne({ _id: _idu, "University_Courses._id": _idc }, { $push: { "University_Courses.$.Course_Branches": req.body } }, { new: true })
        res.send(AddBranch);
    } catch (e) {
        res.status(402).send(e);
    }
})

// Here We Will Handle the Put Request For Adding Years in Courses of University
router.put("/university/course/year/:idu/:idc", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        // Here First We Have to Find the Object by id And Then Find The Array Of Object With that Id And Push it Using Push Method
        const AddYear = await University.updateOne({ _id: _idu, "University_Courses._id": _idc }, { $push: { "University_Courses.$.Course_Years": req.body } }, { new: true })
        res.send(AddYear);
    } catch (e) {
        res.status(402).send(e);
    }
})

// Here, We Handle Patch Request For Update Branches in Courses of University
router.patch("/university/course/branch/:idu/:idc/:branchindex", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        const branchindex = req.params.branchindex
        const updateBranch = `University_Courses.$.Course_Branches.${branchindex}` // !Important How To Pass const values in (query,update, options) of mongodb
        await University.updateOne({ _id: _idu, "University_Courses._id": _idc }, { $set: { [`${updateBranch}`]: req.body } }, { new: true }) // Use const or external object or variable in mongo using array [] and then backlits[`${external object or value}`] to enter external object or value
        res.send(true);
    } catch (e) {
        res.send(false);
    }
})

// Here, We Handle Patch Request For Update Years in Courses of University
router.patch("/university/course/year/:idu/:idc/:yearindex", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        const yearindex = req.params.yearindex
        const updateYear = `University_Courses.$.Course_Years.${yearindex}` // !Important How To Pass const values in (query,update, options) of mongodb
        await University.updateOne({ _id: _idu, "University_Courses._id": _idc }, { $set: { [`${updateYear}`]: req.body } }, { new: true }) // Use const or external object or variable in mongo using array [] and then backlits[`${external object or value}`] to enter external object or value
        res.send(true);
    } catch (e) {
        res.send(false);
    }
})

// Here We Handle Delete Request for Deleting Branches in Courses of University
router.delete("/university/course/branch/:idu/:idc/:idb", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        const _idb = req.params.idb
        await University.updateOne({ "_id": _idu, "University_Courses._id": _idc }, { $pull: { "University_Courses.$.Course_Branches": { "_id": _idb } } }, { new: true });
        res.send(true)
    } catch (e) {
        res.send(false);
    }
})

// Here We Handle Delete Request for Deleting Years in Courses of University
router.delete("/university/course/year/:idu/:idc/:idy", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idc = req.params.idc
        const _idy = req.params.idy
        await University.updateOne({ "_id": _idu, "University_Courses._id": _idc }, { $pull: { "University_Courses.$.Course_Years": { "_id": _idy } } }, { new: true });
        res.send(true)
    } catch (e) {
        res.send(false);
    }
})

// API For Mobile App

// Get Request for Getting Published Universities
router.get("/universities/published", async (req, res) => {
    try {
        const PublishedUniversities = await University.find({ University_Published: true });
        res.json(PublishedUniversities);
    } catch (e) {
        res.send(e);
    }
})

// Get Request for Getting Courses According to University
router.get("/university/:university/courses/published", async (req, res) => {
    try {
        const university = req.params.university
        const selectedUniversity = await University.find({ University_Published: true, University_Name: university });
        const courses = await selectedUniversity[0].University_Courses
        const coursesOptions = await courses.filter(value => value.Course_Published === true);
        res.json(coursesOptions);
    } catch (e) {
        res.send(e);
    }
})

// Get Request for Getting Branches According to Courses
router.get("/university/:university/course/:course/branches/published", async (req, res) => {
    try {
        const university = req.params.university
        const course = req.params.course
        const selectedUniversity = await University.find({ University_Published: true, University_Name: university });
        const courses = await selectedUniversity[0].University_Courses
        const coursesOptions = await courses.filter(courses => courses.Course_Published === true);
        const selectedCourse = await coursesOptions.find(value => value.Course_Name === course)
        const branches = await selectedCourse.Course_Branches
        const branchesOptions = await branches.filter(branches => branches.Branch_Published === true)
        res.json(branchesOptions);
    } catch (e) {
        res.send(e);
    }
})

// Get Request for Getting Years According to Courses
router.get("/university/:university/course/:course/years/published", async (req, res) => {
    try {
        const university = req.params.university
        const course = req.params.course
        const selectedUniversity = await University.find({ University_Published: true, University_Name: university });
        const courses = await selectedUniversity[0].University_Courses
        const coursesOptions = await courses.filter(courses => courses.Course_Published === true);
        const selectedCourse = await coursesOptions.find(value => value.Course_Name === course)
        const years = await selectedCourse.Course_Years
        const yearsOptions = await years.filter(years => years.Year_Published === true)
        res.json(yearsOptions);
    } catch (e) {
        res.send(e);
    }
})

//  Routing For University News

// Get Resuest For Getting Only Uiversity News
router.get("/university/news/:idu", async (req, res) => {
    try {
        const _id = req.params.idu
        const ShowUniversityNews = await University.find({ _id: _id }).select('University_News');
        res.status(200).send(ShowUniversityNews);
    } catch (err) {
        res.status(402).json(err);
    }
});

//  API to Add News in the University
router.put('/university/news/:idu', async (req, res) => {
    try {
        const _id = req.params.idu
        await University.updateOne({ _id: _id }, { $push: { 'University_News': req.body } }, { new: true });
        res.status(200).send(true);
    } catch (error) {
        res.status(402).json(false);
    }
});

// Here We Handle Delete Request for Deleting University News
router.delete("/university/news/:idu/:idn", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idn = req.params.idn
        await University.updateOne({ _id: _idu }, { $pull: { "University_News": { "_id": _idn } } }, { new: true })
        res.send(true);
    } catch (e) {
        res.send(false)
    }
})

// Here, We Handle Patch Request For Update News of University
router.patch("/university/news/:idu/:idn", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idn = req.params.idn
        await University.updateOne({ _id: _idu, "University_News._id": _idn }, { $set: req.body }, { new: true })
        res.send(true);
    } catch (e) {
        res.send(false);
    }
})

module.exports = router