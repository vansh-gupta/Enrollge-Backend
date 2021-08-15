const express = require("express");
const router = new express.Router();
const Subjects = require("../../models/subjects");
// Microsoft Azure Configuration
const { BlobServiceClient } = require("@azure/storage-blob");
const blobServiceClient = new BlobServiceClient(process.env.AZURE_BLOB_SECRET_ACCESS_TOKENS);

// Handle POST Request, For Adding Subjects in Enrollge
router.post("/admin/subjects/add", async (req, res) => {
    try {
        const AddSubject = new Subjects(req.body)
        await AddSubject.save();
        res.send({ SubjectAdded: true });
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Get Request, For Gettings Subjects
router.get("/admin/subjects", async (req, res) => {
    try {
        const ShowAllSubjects = await Subjects.find({}).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published');
        res.send(ShowAllSubjects);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle Get Request, For Getting Subject of All Chapters
router.get("/admin/subject/chapters/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const ShowSubject = await Subjects.find({ _id: _id }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true });
        const Chapters = await ShowSubject[0].Chapters
        res.send(Chapters);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle Get Request, For Getting Subject of Chapter of All Topics
router.get("/admin/subject/chapter/topics/:id/:chapterindex", async (req, res) => {
    try {
        const _id = req.params.id
        const chapterindex = req.params.chapterindex
        const ShowSubject = await Subjects.find({ _id: _id }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true });
        const Topics = await ShowSubject[0].Chapters[chapterindex].Topics
        res.send(Topics);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle GET Request, For Searching Subjects By Name
router.get("/admin/subjects/name/:subjectname", async (req, res) => {
    try {
        const subjectname = req.params.subjectname
        const ShowByNameSubjects = await Subjects.find({ Subject_Name: new RegExp(subjectname, 'i') }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published');
        res.send(ShowByNameSubjects);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle GET Request, For Searching Subjects By Course
router.get("/admin/subjects/course/:subjectcourse", async (req, res) => {
    try {
        const subjectcourse = req.params.subjectcourse
        const ShowByCourseSubjects = await Subjects.find({ Subject_Course: new RegExp(subjectcourse, 'i') }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published');
        res.send(ShowByCourseSubjects);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle Get Request, For Searching Subjects By Branch
router.get("/admin/subjects/branch/:subjectbranch", async (req, res) => {
    try {
        const subjectbranch = req.params.subjectbranch
        const ShowByBranchSubjects = await Subjects.find({ Subject_Branch: new RegExp(subjectbranch, 'i') }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published');
        res.send(ShowByBranchSubjects);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle Get Request, For Searching Subjects By Year
router.get("/admin/subjects/year/:subjectyear", async (req, res) => {
    try {
        const subjectyear = req.params.subjectyear
        const ShowByYearSubjects = await Subjects.find({ Subject_Year: new RegExp(subjectyear, 'i') }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published');
        res.send(ShowByYearSubjects);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle Get Request, For Searching Subjects By University
router.get("/admin/subjects/university/:subjectuniversity", async (req, res) => {
    try {
        const subjectuniversity = req.params.subjectuniversity
        const ShowByUniversitySubjects = await Subjects.find({ Subject_University: new RegExp(subjectuniversity, 'i') }).sort({ Subject_Order: 1 }).collation({ locale: "en_US", numericOrdering: true }).select('Subject_Name Subject_Order Subject_University Subject_Course Subject_Branch Subject_Year Subject_Published');
        res.send(ShowByUniversitySubjects);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Handle Patch Request, For Update Subject Details
router.patch("/admin/subjects/update/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await Subjects.findByIdAndUpdate({ _id: _id }, req.body, { new: true })
        res.send({ SubjectUpdated: true });
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Patch Request, For Update Chapter of Subject Details
router.patch("/admin/subjects/chapters/update/:ids/:idc", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idc = req.params.idc
        await Subjects.updateOne({ _id: _ids, "Chapters._id": _idc }, { $set: req.body }, { new: true })
        res.send({ ChapterUpdated: true });
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Patch Request, For Update Topic of Chapter of Subject Details
router.patch("/admin/subjects/chapters/topics/update/:ids/:idc/:topicindex", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idc = req.params.idc
        const topicindex = req.params.topicindex
        const updateTopic = `Chapters.$.Topics.${topicindex}` // !Important How To Pass const values in (query,update, options) of mongodb
        await Subjects.updateOne({ _id: _ids, "Chapters._id": _idc }, { $set: { [`${updateTopic}`]: req.body } }, { new: true }) // Use const or external object or variable in mongo using array [] and then backlits[`${external object or value}`] to enter external object or value
        res.send({ TopicUpdated: true });
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Put Request, For Adding Chapter in Subjects
router.put("/admin/subjects/chapters/add/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await Subjects.updateOne({ _id: _id }, { $push: { 'Chapters': req.body } }, { new: true })
        res.send({ ChapterAdded: true });
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Put Request, For Adding Topic in Subjects of Chapter
router.put("/admin/subjects/chapters/topics/add/:ids/:idc", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idc = req.params.idc
        // Here First We Have to Find the Object by id And Then Find The Array Of Object With that Id And Push it Using Push Method
        await Subjects.update({ _id: _ids, "Chapters._id": _idc }, { $push: { "Chapters.$.Topics": req.body } }, { new: true })
        res.send({ AddedTopic: 'OK' });
    } catch (e) {
        res.status(402).send({ error: e.message });
    }
})

// Handle Delete Request, For Deleting Subject
router.delete("/admin/subject/delete/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await Subjects.findByIdAndDelete({ _id: _id })
        res.send({ SubjectDeleted: true });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

// Handle Delete Request, For Deleting Chapter of Subject
router.delete("/admin/subjects/chapters/delete/:ids/:idc", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idc = req.params.idc
        await Subjects.update({ _id: _ids }, { $pull: { "Chapters": { "_id": _idc } } }, { new: true })
        res.send({ ChapterDeleted: true });
    } catch (e) {
        res.send({ error: e.message })
    }
})

// Handle Delete Request, For Deleting Topic of Subject
router.delete("/admin/subjects/chapters/topics/delete/:ids/:idc/:idt", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idc = req.params.idc
        const _idt = req.params.idt
        await Subjects.update({ "_id": _ids, "Chapters._id": _idc }, { $pull: { "Chapters.$.Topics": { "_id": _idt } } }, { new: true });
        res.send({ TopicDeleted: true })
    } catch (e) {
        res.send({ error: e.message });
    }
})





// (********************************) Handle API for Syllabus of Subject for Admin Panel (********************************)





const fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']

// Handle Patch Request, For Updating Syllabus File in Subject
router.patch("/admin/subjects/syllabus/update/:id", async (req, res) => {
    try {
        const file = req.files.file
        const _id = req.params.id
        const Subject = await Subjects.find({ _id: _id }).select('Subject_Syllabus Subject_Name Subject_University Subject_Course Subject_Branch Subject_Year');
        const { Subject_University, Subject_Course, Subject_Branch, Subject_Year, Subject_Name } = await Subject[0]
        const SyllabusUploaded = await Subject[0].Subject_Syllabus.FileName

        if (typeof SyllabusUploaded === "undefined" || SyllabusUploaded === null) {
            if (fileType.includes(file.mimetype)) {
                // Uploading Files to Blob Storage
                const containerName = `${Subject_Course}SubjectsSyllabus`
                const containerClient = await blobServiceClient.getContainerClient(containerName);
                const blobName = `${Subject_University}-${Subject_Course}-${Subject_Branch.toString()}-${Subject_Year}-${Subject_Name}-${file.name}`
                const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                const blobOptions = { blobHTTPHeaders: { blobContentType: file.mimetype } };
                await blockBlobClient.upload(file.data, file.data.length, blobOptions);
                // Updating Data in Database
                if (blockBlobClient.url) {
                    await Subjects.findByIdAndUpdate({ _id: _id }, {
                        Subject_Syllabus: {
                            FileName: blobName,
                            FileType: file.mimetype,
                            FileUrl: blockBlobClient.url,
                            FileContainerName: containerName
                        }
                    }, { new: true });
                    res.send({ FileAdded: true });
                }
            } else {
                res.send({ FileAdded: false, ErrorMsg: "Please Upload JPG, JPEG, PNG & PDf File Type" });
            }
        } else {
            res.send({ FileAdded: false, ErrorMsg: "Please Delete the Uploaded File First !!" });
        }
    } catch (error) {
        res.send({ FileAdded: false, ErrorMsg: error.message });
    }
});

// Handle Get Request, For Getting Syllabus File of Subject
router.get("/admin/subject/syllabus/file/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const ShowSubjectSyllabus = await Subjects.find({ _id: _id }).select('Subject_Syllabus');
        const Syllabus = await ShowSubjectSyllabus[0].Subject_Syllabus
        res.json(Syllabus);
    } catch (e) {
        res.json({ error: e.message });
    }
})

// Handle Patch Request, For Deleting Syllabus File of Subject
router.patch("/admin/subjects/syllabus/delete/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const ShowSubjectSyllabus = await Subjects.find({ _id: _id }).select('Subject_Syllabus');
        const blobName = await ShowSubjectSyllabus[0].Subject_Syllabus.FileName

        if (blobName !== null && typeof blobName !== "undefined") {
            const containerName = `${blobName.split('-')[1]}SubjectsSyllabus`
            const containerClient = await blobServiceClient.getContainerClient(containerName);
            const fileDeleted = await containerClient.deleteBlob(blobName);
            if (fileDeleted) {
                await Subjects.findByIdAndUpdate({ _id: _id }, {
                    Subject_Syllabus: {
                        FileName: null,
                        FileType: null,
                        FileUrl: null,
                        FileContainerName: null
                    }
                }, { new: true });
                res.send({ FileDeleted: true });
            }
        } else {
            res.send({ FileDeleted: false, ErrorMsg: "There is no file to delete" });
        }
    } catch (e) {
        res.send({ FileDeleted: false, ErrorMsg: e.message });
    }
});

module.exports = router