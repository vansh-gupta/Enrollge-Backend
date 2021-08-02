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

// Here, We Handle Get Request For Subjects
router.get("/subjects", async (req, res) => {
    try {
        const ShowAllSubjects = await Subjects.find({}).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published Chapters');
        res.send(ShowAllSubjects);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Here, We Handle Get Request For Searching Subjects By Name
router.get("/subjects/name/:subjectname", async (req, res) => {
    try {
        const subjectname = req.params.subjectname
        const ShowByNameSubjects = await Subjects.find({ Subject_Name: new RegExp(subjectname, 'i') }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published Chapters');
        res.send(ShowByNameSubjects);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Here, We Handle Get Request For Searching Subjects By Course
router.get("/subjects/course/:subjectcourse", async (req, res) => {
    try {
        const subjectcourse = req.params.subjectcourse
        const ShowByCourseSubjects = await Subjects.find({ Subject_Course: new RegExp(subjectcourse, 'i') }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published Chapters');
        res.send(ShowByCourseSubjects);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Here, We Handle Get Request For Searching Subjects By Branch
router.get("/subjects/branch/:subjectbranch", async (req, res) => {
    try {
        const subjectbranch = req.params.subjectbranch
        const ShowByBranchSubjects = await Subjects.find({ Subject_Branch: new RegExp(subjectbranch, 'i') }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published Chapters');
        res.send(ShowByBranchSubjects);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Here, We Handle Get Request For Searching Subjects By Year
router.get("/subjects/year/:subjectyear", async (req, res) => {
    try {
        const subjectyear = req.params.subjectyear
        const ShowByYearSubjects = await Subjects.find({ Subject_Year: new RegExp(subjectyear, 'i') }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published Chapters');
        res.send(ShowByYearSubjects);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Here, We Handle Get Request For Searching Subjects By University
router.get("/subjects/university/:subjectuniversity", async (req, res) => {
    try {
        const subjectuniversity = req.params.subjectuniversity
        const ShowByUniversitySubjects = await Subjects.find({ Subject_University: new RegExp(subjectuniversity, 'i') }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published Chapters');
        res.send(ShowByUniversitySubjects);
    } catch (e) {
        res.status(400).send(e);
    }
});

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
        const ShowSubject = await Subjects.find({ _id: _id }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published Chapters');
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

// Get API For Getting Subjects According to the University (For Admin Panel)
router.get("/subjects/university/:university", async (req, res) => {
    try {
        const university = req.params.university
        const SelectedSubject = await Subjects.find({ Subject_University: university }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published Chapters');
        res.json(SelectedSubject);
    } catch (e) {
        res.status(402).json(e)
    }
});

// Here Now We Make Api For Mobile Enrollge App
router.get("/subjects/:university/:course/:branch/:year", async (req, res) => {
    try {
        const course = req.params.course
        const university = req.params.university
        const branch = req.params.branch
        const year = req.params.year
        const SelectedSubject = await Subjects.find({
            $and: [
                { Subject_Branch: { $in: branch } },
                { Subject_University: university },
                { Subject_Course: course },
                { Subject_Year: year }
            ]
        }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published Chapters');
        res.json(SelectedSubject);
    } catch (e) {
        res.status(402).json(e)
    }
});


// API Routing for Syllabus of Subject in Admin Panel

const fileType = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']

// Routing For Adding Syllabus Files in Subject
router.patch("/subjects/syllabus/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const { Syllabus_FileName, Syllabus_EncodedFile, Syllabus_FileType } = req.body
        if (Syllabus_EncodedFile === null) {
            res.send({ FileAdded: false, ErrorMsg: 'Please Select the Files' });
        }

        if (Syllabus_EncodedFile !== null && fileType.includes(Syllabus_FileType)) {
            const EncodedFile = new Buffer.from(Syllabus_EncodedFile, 'base64');
            const EncodedFileType = Syllabus_FileType
            await Subjects.findByIdAndUpdate({ _id: _id }, {
                Subject_Syllabus: {
                    Syllabus_FileName: Syllabus_FileName,
                    Syllabus_EncodedFile: EncodedFile,
                    Syllabus_FileType: EncodedFileType
                }
            }, { new: true });
            res.send({ FileAdded: true });
        }
    } catch (e) {
        res.send({ FileAdded: false, ErrorMsg: e });
    }
});

// Now We Handle Get Request For Subjects's Syllabus
router.get("/subject/syllabus/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const ShowSubjectSyllabus = await Subjects.find({ _id: _id }).select('Subject_Syllabus');
        const Syllabus = await ShowSubjectSyllabus[0].Subject_Syllabus
        res.json({ Syllabus_FileName: Syllabus.Syllabus_FileName, Syllabus_FileType: Syllabus.Syllabus_FileType, Syllabus_File: `data:${Syllabus.Syllabus_FileType};charset-utf-8;base64,${Syllabus.Syllabus_EncodedFile.toString('base64')}` });
    } catch (e) {
        res.json(e);
    }
})

// Routing For Deleting Syllabus Files in Subject
router.patch("/subjects/syllabus/:id/delete", async (req, res) => {
    try {
        const _id = req.params.id
        await Subjects.findByIdAndUpdate({ _id: _id }, {
            Subject_Syllabus: {
                Syllabus_FileName: null,
                Syllabus_EncodedFile: null,
                Syllabus_FileType: null
            }
        }, { new: true });
        res.send(true);
    } catch (e) {
        res.send(false);
    }
});


module.exports = router