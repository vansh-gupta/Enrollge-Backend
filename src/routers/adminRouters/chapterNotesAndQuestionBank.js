const express = require("express");
const router = new express.Router();
const Subjects = require("../../models/subjects");
// Microsoft Azure Configuration
const { BlobServiceClient } = require("@azure/storage-blob");
const blobServiceClient = new BlobServiceClient(process.env.AZURE_BLOB_SECRET_ACCESS_TOKENS);

const fileType = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']

// Handle Patch Request, For Update Chapter Notes of Subject
router.patch("/admin/subject/chapter/notes/update/:ids/:idc", async (req, res) => {
    try {
        const file = req.files.file
        const _ids = req.params.ids
        const _idc = req.params.idc
        const { ChapterName } = req.body
        const SelectedSubjects = await Subjects.find({ _id: _ids }).select('Chapters Subject_Name Subject_University Subject_Course Subject_Branch Subject_Year');
        const { Subject_University, Subject_Course, Subject_Branch, Subject_Year, Subject_Name } = SelectedSubjects[0]
        const Chapters = await SelectedSubjects[0].Chapters
        const SelectedChapter = Chapters.filter(value => value.Chapter_Name === ChapterName);
        const NotesFileName = await SelectedChapter[0].Chapter_Notes.FileName

        if (typeof NotesFileName === 'undefined' || NotesFileName === null) {
            if (fileType.includes(file.mimetype)) {
                // Uploading Files to Blob Storage
                const containerName = `${Subject_Course}ChapterNotes`
                const containerClient = await blobServiceClient.getContainerClient(containerName);
                const blobName = `${Subject_University}-${Subject_Course.toString()}-${Subject_Branch}-${Subject_Year}-${Subject_Name}-${ChapterName}-${file.name}`
                const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                await blockBlobClient.upload(file.data, file.data.length);
                // Updating Data in Database
                if (blockBlobClient.url) {
                    await Subjects.updateOne({ _id: _ids, "Chapters._id": _idc }, {
                        $set: {
                            "Chapters.$.Chapter_Notes": {
                                FileName: blobName,
                                FileType: file.mimetype,
                                FileUrl: blockBlobClient.url,
                                FileContainerName: containerName
                            }
                        }
                    }, { new: true })
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
})

// Handle Patch Request, For Update Chapter Question Bank of Subject
router.patch("/admin/subject/chapter/questionbank/update/:ids/:idc", async (req, res) => {
    try {
        const file = req.files.file
        const _ids = req.params.ids
        const _idc = req.params.idc
        const { ChapterName } = req.body
        const SelectedSubjects = await Subjects.find({ _id: _ids }).select('Chapters Subject_Name Subject_University Subject_Course Subject_Branch Subject_Year');
        const { Subject_University, Subject_Course, Subject_Branch, Subject_Year, Subject_Name } = SelectedSubjects[0]
        const Chapters = await SelectedSubjects[0].Chapters
        const SelectedChapter = Chapters.filter(value => value.Chapter_Name === ChapterName);
        const QuestionBankFileName = await SelectedChapter[0].Chapter_QuestionBank.FileName

        if (typeof QuestionBankFileName === 'undefined' || QuestionBankFileName === null) {
            if (fileType.includes(file.mimetype)) {
                // Uploading Files to Blob Storage
                const containerName = `${Subject_Course}QuestionBank`
                const containerClient = await blobServiceClient.getContainerClient(containerName);
                const blobName = `${Subject_University}-${Subject_Course}-${Subject_Branch.toString()}-${Subject_Year}-${Subject_Name}-${ChapterName}-${file.name}`
                const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                await blockBlobClient.upload(file.data, file.data.length);
                // Updating Data in Database
                if (blockBlobClient.url) {
                    await Subjects.updateOne({ _id: _ids, "Chapters._id": _idc }, {
                        $set: {
                            "Chapters.$.Chapter_QuestionBank": {
                                FileName: blobName,
                                FileType: file.mimetype,
                                FileUrl: blockBlobClient.url,
                                FileContainerName: containerName
                            }
                        }
                    }, { new: true })
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
})

// Handle Delete Request, For Deleting Notes of Chapter
router.patch("/admin/subject/chapter/notes/delete/:ids/:idc", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idc = req.params.idc
        const { ChapterName } = req.body
        const SelectedSubjects = await Subjects.find({ _id: _ids }).select('Chapters');
        const Chapters = await SelectedSubjects[0].Chapters
        const SelectedChapter = Chapters.filter(value => value.Chapter_Name === ChapterName);
        const NotesFileName = await SelectedChapter[0].Chapter_Notes.FileName

        if (NotesFileName !== null && typeof NotesFileName !== "undefined") {
            // Deleting From Microsoft Azure Blob Storage
            const blobName = await NotesFileName
            const containerName = `${blobName.split('-')[1]}ChapterNotes`
            const containerClient = await blobServiceClient.getContainerClient(containerName);
            const fileDeleted = await containerClient.deleteBlob(blobName);
            if (fileDeleted) {
                // Deleting From Database
                await Subjects.updateOne({ _id: _ids, "Chapters._id": _idc }, {
                    $set: {
                        "Chapters.$.Chapter_Notes": {
                            FileName: null,
                            FileType: null,
                            FileUrl: null,
                            FileContainerName: null
                        }
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
})

// Handle Delete Request, For Deleting Question Bank of Chapter
router.patch("/admin/subject/chapter/questionbank/delete/:ids/:idc", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idc = req.params.idc
        const { ChapterName } = req.body
        const SelectedSubjects = await Subjects.find({ _id: _ids }).select('Chapters');
        const Chapters = await SelectedSubjects[0].Chapters
        const SelectedChapter = Chapters.filter(value => value.Chapter_Name === ChapterName);
        const QuestionBankFileName = await SelectedChapter[0].Chapter_QuestionBank.FileName

        if (QuestionBankFileName !== null && typeof QuestionBankFileName !== "undefined") {
            // Deleting From Microsoft Azure Blob Storage
            const blobName = await QuestionBankFileName
            const containerName = `${blobName.split('-')[1]}QuestionBank`
            const containerClient = await blobServiceClient.getContainerClient(containerName);
            const fileDeleted = await containerClient.deleteBlob(blobName);
            if (fileDeleted) {
                // Deleting From Database
                await Subjects.updateOne({ _id: _ids, "Chapters._id": _idc }, {
                    $set: {
                        "Chapters.$.Chapter_QuestionBank": {
                            FileName: null,
                            FileType: null,
                            FileUrl: null,
                            FileContainerName: null
                        }
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
})

// Handle Get Request, For Getting Notes File of Chapter
router.get("/admin/subject/chapter/notes/file/:id/:chapterindex", async (req, res) => {
    try {
        const _id = req.params.id
        const chapterindex = req.params.chapterindex
        const ShowSubject = await Subjects.find({ _id: _id }).select('Chapters');
        const ShowChapter = await ShowSubject[0].Chapters[chapterindex]
        const Chapter_Notes = await ShowChapter.Chapter_Notes
        res.send(Chapter_Notes);
    } catch (e) {
        res.send({ error: e.message });
    }
})

// Handle Get Request, For Question Bank File of Chapter
router.get("/admin/subject/chapter/questionbank/file/:id/:chapterindex", async (req, res) => {
    try {
        const _id = req.params.id
        const chapterindex = req.params.chapterindex
        const ShowSubject = await Subjects.find({ _id: _id }).select('Chapters');
        const ShowChapter = await ShowSubject[0].Chapters[chapterindex]
        const Chapter_QuestionBank = await ShowChapter.Chapter_QuestionBank
        res.send(Chapter_QuestionBank);
    } catch (e) {
        res.send({ error: e.message });
    }
})

module.exports = router