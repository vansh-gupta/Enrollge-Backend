const express = require("express");
const router = new express.Router();
const Subjects = require("../../models/subjects");
const { v4: uuidv4 } = require('uuid');
// Microsoft Azure Configuration
const { BlobServiceClient } = require("@azure/storage-blob");
const blobServiceClient = new BlobServiceClient(process.env.AZURE_BLOB_SECRET_ACCESS_TOKENS);

const fileType = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']

// Handle Patch Request, For Adding Previous Year Paper of Subject
router.patch('/admin/subject/previousyearpaper/add/:id', async (req, res) => {
    try {
        const file = req.files.file
        const _id = req.params.id
        const { PYQ_PaperName, PYQ_PaperOrder } = req.body
        const SelectedSubjects = await Subjects.find({ _id: _id }).select('Subject_Name Subject_University Subject_Course Subject_Branch Subject_Year');
        const { Subject_University, Subject_Course, Subject_Branch, Subject_Year, Subject_Name } = SelectedSubjects[0]


        if (fileType.includes(file.mimetype)) {
            // Uploading Files to Blob Storage
            const containerName = `${Subject_Course}PreviousYearPaper`
            const containerClient = await blobServiceClient.getContainerClient(containerName);
            const blobName = `${Subject_University}-${Subject_Course.toString()}-${Subject_Branch}-${Subject_Year}-${Subject_Name}-${PYQ_PaperName}-${file.name}`
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.upload(file.data, file.data.length);
            // Updating Data in Database
            if (blockBlobClient.url) {
                await Subjects.updateOne({ _id: _id }, {
                    $push: {
                        'Subject_PreviousYearPapers': {
                            PYQ_PaperName: PYQ_PaperName,
                            PYQ_PaperOrder: PYQ_PaperOrder,
                            PYQ_UUID: uuidv4(),
                            PYQ_PaperFile: {
                                FileName: blobName,
                                FileUrl: blockBlobClient.url
                            }
                        }
                    }
                }, { new: true })
                res.send({ FileAdded: true });
            }
        } else {
            res.send({ FileAdded: false, ErrorMsg: "Please Upload JPG, JPEG, PNG & PDf File Type" });
        }
    } catch (error) {
        res.send({ FileAdded: false, ErrorMsg: error.message });
    }
});

// Handle Patch Request, For Updating Previous Year Paper With File of Subject
router.patch('/admin/subject/pyqp/update/withfile/:ids/:idp', async (req, res) => {
    try {
        const file = req.files.file
        const _ids = req.params.ids
        const _idp = req.params.idp
        const { PYQ_PaperName, PYQ_PaperOrder, PYQ_UUID } = req.body
        // Getting Data Fropm Database
        const SelectedSubjects = await Subjects.find({ _id: _ids }).select('Subject_PreviousYearPapers Subject_Name Subject_University Subject_Course Subject_Branch Subject_Year');
        const { Subject_University, Subject_Course, Subject_Branch, Subject_Year, Subject_Name } = SelectedSubjects[0]
        const SubjectPYP = await SelectedSubjects[0].Subject_PreviousYearPapers
        const selectedPYP = await SubjectPYP.find(item => item.PYQ_UUID === PYQ_UUID);
        const PYPFileName = await selectedPYP.PYQ_PaperFile.FileName

        // Checking that user uploaded Correct File Format !!
        if (fileType.includes(file.mimetype)) {
            if (PYPFileName !== null && typeof PYPFileName !== "undefined") {
                // Deleting File From Microsoft Azure Blob Storage
                const blobName = await PYPFileName
                const containerName = `${blobName.split('-')[1]}PreviousYearPaper`
                const containerClient = await blobServiceClient.getContainerClient(containerName);
                const fileDeleted = await containerClient.deleteBlob(blobName);

                // Updating Files from Mongodb And Blob Storage
                if (fileDeleted) {
                    // Uploading Files to Blob Storage
                    const containerName = `${Subject_Course}PreviousYearPaper`
                    const containerClient = await blobServiceClient.getContainerClient(containerName);
                    const blobName = `${Subject_University}-${Subject_Course.toString()}-${Subject_Branch}-${Subject_Year}-${Subject_Name}-${PYQ_PaperName}-${file.name}`
                    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                    await blockBlobClient.upload(file.data, file.data.length);
                    // Updating Data in Database
                    if (blockBlobClient.url) {
                        await Subjects.updateOne({ _id: _ids, "Subject_PreviousYearPapers._id": _idp }, {
                            $set: {
                                "Subject_PreviousYearPapers.$.PYQ_PaperName": PYQ_PaperName,
                                "Subject_PreviousYearPapers.$.PYQ_PaperOrder": PYQ_PaperOrder,
                                "Subject_PreviousYearPapers.$.PYQ_PaperFile": {
                                    FileName: blobName,
                                    FileUrl: blockBlobClient.url
                                }
                            }
                        }, { new: true });
                        res.send({ PYQPUpdated: true });
                    }
                } else {
                    res.send({ PYQPUpdated: false, ErrorMsg: "File Not Deleted From Blob Storage" });
                }
            } else {
                // Uploading Files to Blob Storage
                const containerName = `${Subject_Course}PreviousYearPaper`
                const containerClient = await blobServiceClient.getContainerClient(containerName);
                const blobName = `${Subject_University}-${Subject_Course.toString()}-${Subject_Branch}-${Subject_Year}-${Subject_Name}-${PYQ_PaperName}-${file.name}`
                const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                await blockBlobClient.upload(file.data, file.data.length);
                // Updating Data in Database
                if (blockBlobClient.url) {
                    await Subjects.updateOne({ _id: _ids, "Subject_PreviousYearPapers._id": _idp }, {
                        $set: {
                            "Subject_PreviousYearPapers.$.PYQ_PaperName": PYQ_PaperName,
                            "Subject_PreviousYearPapers.$.PYQ_PaperOrder": PYQ_PaperOrder,
                            "Subject_PreviousYearPapers.$.PYQ_PaperFile": {
                                FileName: blobName,
                                FileUrl: blockBlobClient.url
                            }
                        }
                    }, { new: true });
                    res.send({ PYQPUpdated: true });
                }
            }
        }
    } catch (e) {
        res.send({ PYQPUpdated: false, ErrorMsg: e.message });
    }
});

// Handle Patch Request, For Updating Previous Year Paper Without File of Subject
router.patch('/admin/subject/pyqp/update/withoutfile/:ids/:idp', async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idp = req.params.idp
        const { PYQ_PaperName, PYQ_PaperOrder } = req.body
        await Subjects.updateOne({ _id: _ids, "Subject_PreviousYearPapers._id": _idp }, {
            $set: {
                "Subject_PreviousYearPapers.$.PYQ_PaperName": PYQ_PaperName,
                "Subject_PreviousYearPapers.$.PYQ_PaperOrder": PYQ_PaperOrder
            }
        }, { new: true });
        res.send({ PYQPUpdated: true });
    } catch (e) {
        res.send({ PYQPUpdated: false, ErrorMsg: e.message });
    }
})

// Handle Patch Request, For Deleting Previous Year Paper File of Subject
router.patch('/admin/subject/pyqp/file/delete/:ids/:idp', async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idp = req.params.idp
        const { PYQ_UUID } = req.body
        const SelectedSubjects = await Subjects.find({ _id: _ids }).select('Subject_PreviousYearPapers');
        const SubjectPYP = await SelectedSubjects[0].Subject_PreviousYearPapers
        const selectedPYP = await SubjectPYP.find(item => item.PYQ_UUID === PYQ_UUID);
        const PYPFileName = await selectedPYP.PYQ_PaperFile.FileName

        if (PYPFileName !== null && typeof PYPFileName !== "undefined") {
            // Deleting From Microsoft Azure Blob Storage
            const blobName = await PYPFileName
            const containerName = `${blobName.split('-')[1]}PreviousYearPaper`
            const containerClient = await blobServiceClient.getContainerClient(containerName);
            const fileDeleted = await containerClient.deleteBlob(blobName);
            if (fileDeleted) {
                // Deleting From Database
                await Subjects.updateOne({ _id: _ids, "Subject_PreviousYearPapers._id": _idp }, {
                    $set: {
                        "Subject_PreviousYearPapers.$.PYQ_PaperFile": {
                            FileName: null,
                            FileUrl: null
                        }
                    }
                }, { new: true })
                res.send({ FileDeleted: true });
            }
        } else {
            res.send({ FileDeleted: false, ErrorMsg: "There is no file to delete" });
        }
    } catch (e) {
        res.send({ FileDeleted: false, ErrorMsg: e.message });
    }
});

// Handle Delete Request, For Deleting Subject's Previous Year Paper
router.delete("/admin/subject/previousyearpaper/delete/:ids/:idp/:pyquuid", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idp = req.params.idp
        const pyquuid = req.params.pyquuid
        const SelectedSubjects = await Subjects.find({ _id: _ids }).select('Subject_PreviousYearPapers');
        const SubjectPYP = await SelectedSubjects[0].Subject_PreviousYearPapers
        const selectedPYP = await SubjectPYP.find(item => item.PYQ_UUID === pyquuid);
        const PYPFileName = await selectedPYP.PYQ_PaperFile.FileName

        if (PYPFileName !== null && typeof PYPFileName !== "undefined") {
            // Deleting From Microsoft Azure Blob Storage
            const blobName = await PYPFileName
            const containerName = `${blobName.split('-')[1]}PreviousYearPaper`
            const containerClient = await blobServiceClient.getContainerClient(containerName);
            const fileDeleted = await containerClient.deleteBlob(blobName);
            if (fileDeleted) {
                // Deleting From Database
                await Subjects.updateOne({ _id: _ids }, { $pull: { "Subject_PreviousYearPapers": { "_id": _idp } } }, { new: true });
                res.send({ FileDeleted: true });
            }
        } else {
            res.send({ FileDeleted: false, ErrorMsg: "Please Upload the PYQP File First" });
        }
    } catch (e) {
        console.log(e)
        res.send({ FileDeleted: false, ErrorMsg: e.message });
    }
})

// Handle Get Request, For Getting  Previous Year Question Paper of Subject (PYP - Previous Year Paper)
router.get("/admin/subject/pyqp/:id/:pypindex", async (req, res) => {
    try {
        const _id = req.params.id
        const pypindex = req.params.pypindex
        const ShowSubject = await Subjects.find({ _id: _id }).select('Subject_PreviousYearPapers');
        const ShowPYP = await ShowSubject[0].Subject_PreviousYearPapers[pypindex]
        res.send(ShowPYP);
    } catch (e) {
        res.send({ error: e.message });
    }
});

// Handle Get Request, For Getting All Previous Year Question Paper of Subjects (PYP - Previous Year Paper)
router.get("/admin/subject/allpyqp/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const ShowSubject = await Subjects.find({ _id: _id }).select('Subject_PreviousYearPapers');
        const ShowPYQP = await ShowSubject[0].Subject_PreviousYearPapers
        res.send(ShowPYQP)
    } catch (e) {
        res.send({ error: e.message });
    }
})




// (********************************) Handling API For Previous Year Question Paper Answers (********************************)





// Handle PUT Request, For Adding Solutions of Previous Year Question in Subjects
router.put("/admin/subjects/pyqp/pyqps/add/:ids/:idp", async (req, res) => {
    // If You want to use same name then, Please Change the File Name of Solution (So it can make difference in BlobName - So that it will not delete the same file from azure blob storage)
    // In Frontend, Please Try to Not Upload the Solution of Same Name Twice or Thrice (Otherwise When You Delete that file from db then it will aslo delete the file from blob Storage)
    try {
        const file = req.files.file
        const _ids = req.params.ids
        const _idp = req.params.idp
        const { PYQ_SolutionName } = req.body
        const SelectedSubjects = await Subjects.find({ _id: _ids }).select('Subject_Name Subject_University Subject_Course Subject_Branch Subject_Year');
        const { Subject_University, Subject_Course, Subject_Branch, Subject_Year, Subject_Name } = SelectedSubjects[0]

        if (fileType.includes(file.mimetype)) {
            // Uploading Files to Blob Storage
            const containerName = `${Subject_Course}PreviousYearPaper`
            const containerClient = await blobServiceClient.getContainerClient(containerName);
            const blobName = `${Subject_University}-${Subject_Course.toString()}-${Subject_Branch}-${Subject_Year}-${Subject_Name}-${PYQ_SolutionName}-${file.name}`
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.upload(file.data, file.data.length);
            // Updating Data in Database
            if (blockBlobClient.url) {
                // Here First We Have to Find the Object by id And Then Find The Array Of Object With that Id And Push it Using Push Method
                await Subjects.update({ _id: _ids, "Subject_PreviousYearPapers._id": _idp }, {
                    $push: {
                        "Subject_PreviousYearPapers.$.PYQ_PaperSolutions": {
                            PYQ_SolutionName: PYQ_SolutionName,
                            PYQ_SolutionFile: {
                                FileName: blobName,
                                FileUrl: blockBlobClient.url
                            }
                        }
                    }
                }, { new: true });
                res.send({ FileAdded: true });
            }
        } else {
            res.send({ FileAdded: false, ErrorMsg: "Please Upload JPG, JPEG, PNG & PDf File Type" });
        }
    } catch (error) {
        res.send({ FileAdded: false, ErrorMsg: error.message });
    }
})

// Handle Delete Request, For Deleting PYQP Solutions
router.delete("/admin/subjects/pyqp/pyqps/delete/:ids/:idp/:idps/:pyqpsindex/:pyqpsuuid", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idp = req.params.idp
        const _idps = req.params.idps
        const PYQPSindex = req.params.pyqpsindex
        const PYQ_UUID = req.params.pyqpsuuid
        const SelectedSubjects = await Subjects.find({ _id: _ids }).select('Subject_PreviousYearPapers');
        const SubjectPYP = await SelectedSubjects[0].Subject_PreviousYearPapers
        const selectedPYP = await SubjectPYP.find(item => item.PYQ_UUID === PYQ_UUID);
        const PYPFileName = await selectedPYP.PYQ_PaperSolutions[PYQPSindex].PYQ_SolutionFile.FileName
        // Deleting From Microsoft Azure Blob Storage
        const blobName = await PYPFileName
        const containerName = `${blobName.split('-')[1]}PreviousYearPaper`
        const containerClient = await blobServiceClient.getContainerClient(containerName);
        const fileDeleted = await containerClient.deleteBlob(blobName);
        if (fileDeleted) {
            // Deleting From Database
            await Subjects.updateOne({ "_id": _ids, "Subject_PreviousYearPapers._id": _idp }, { $pull: { "Subject_PreviousYearPapers.$.PYQ_PaperSolutions": { "_id": _idps } } }, { new: true });
            res.send({ PYQPSDeleted: true })
        }
    } catch (e) {
        res.send({ PYQPSDeleted: false, ErrorMsg: e.message });
    }
})

// Handle Get Request, For Getting Previous Year Question Paper Solutions File of Subject (PYP - Previous Year Paper)
router.get("/admin/subject/pyqp/pyqps/file/:ids/:pypindex/:pyqpsindex", async (req, res) => {
    try {
        const _ids = req.params.ids
        const pypindex = req.params.pypindex
        const pyqpsindex = req.params.pyqpsindex
        const ShowSubject = await Subjects.find({ _id: _ids }).select('Subject_PreviousYearPapers');
        const ShowPYQPS = await ShowSubject[0].Subject_PreviousYearPapers[pypindex].PYQ_PaperSolutions[pyqpsindex]
        res.send(ShowPYQPS);
    } catch (e) {
        res.send({ error: e.message });
    }
});

// Handle Get Request, For Getting All Previous Year Question Paper Solutions of Subject (PYP - Previous Year Paper)
router.get("/admin/subject/pyqp/pyqps/:id/:pypindex", async (req, res) => {
    try {
        const _id = req.params.id
        const pypindex = req.params.pypindex
        const ShowSubject = await Subjects.find({ _id: _id }).select('Subject_PreviousYearPapers');
        const ShowPYQPS = await ShowSubject[0].Subject_PreviousYearPapers[pypindex].PYQ_PaperSolutions
        res.send(ShowPYQPS);
    } catch (e) {
        res.send({ error: e.message });
    }
});

module.exports = router