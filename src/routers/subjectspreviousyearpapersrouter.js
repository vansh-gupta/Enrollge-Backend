const express = require("express");
const router = new express.Router();
const Subjects = require("../models/subjects")

// Routing For Previous Year Question Papers

const fileType = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']

// Patch Request For Adding Previous Year Paper of Subject
router.patch('/subject/previousyearpaper/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const { PYQ_PaperName, File_Name, Encoded_File, Encoded_FileType, PYQ_PaperOrder } = req.body
        if (Encoded_File === null) {
            res.send({ FileAdded: false, ErrorMsg: 'Please Select the Files' });
        }

        if (Encoded_File !== null && fileType.includes(Encoded_FileType)) {
            const EncodedPYQFile = new Buffer.from(Encoded_File, 'base64');
            await Subjects.updateOne({ _id: _id }, {
                $push: {
                    'Subject_PreviousYearPapers': {
                        PYQ_PaperName: PYQ_PaperName,
                        PYQ_PaperOrder: PYQ_PaperOrder,
                        PYQ_PaperFile: {
                            File_Name: File_Name,
                            Encoded_File: EncodedPYQFile,
                            Encoded_FileType: Encoded_FileType
                        }
                    }
                }
            }, { new: true })
            res.send({ FileAdded: true });
        }
    } catch (error) {
        res.send({ ErrorMsg: error });
    }
});

// Patch Request For Editing Individual Previous Year Paper of Subject
router.patch('/subject/pyqp/edit/:ids/:idp', async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idp = req.params.idp
        const { PYQ_PaperName, PYQ_PaperOrder, File_Name, Encoded_File, Encoded_FileType } = req.body

        // Checking that user upload new PYQP File or Not !!
        if (Encoded_File && fileType.includes(Encoded_FileType)) {
            const EncodedPYQFile = new Buffer.from(Encoded_File, 'base64');
            await Subjects.updateOne({ _id: _ids, "Subject_PreviousYearPapers._id": _idp }, {
                $set: {
                    "Subject_PreviousYearPapers.$.PYQ_PaperName": PYQ_PaperName,
                    "Subject_PreviousYearPapers.$.PYQ_PaperOrder": PYQ_PaperOrder,
                    "Subject_PreviousYearPapers.$.PYQ_PaperFile": {
                        File_Name: File_Name,
                        Encoded_File: EncodedPYQFile,
                        Encoded_FileType: Encoded_FileType
                    }
                }
            }, { new: true });
            res.send({ FileEdited: true });
        }

        // If User not sending the File then Update Only PYQP Name And Order
        if (!Encoded_File) {
            await Subjects.updateOne({ _id: _ids, "Subject_PreviousYearPapers._id": _idp }, {
                $set: {
                    "Subject_PreviousYearPapers.$.PYQ_PaperName": PYQ_PaperName,
                    "Subject_PreviousYearPapers.$.PYQ_PaperOrder": PYQ_PaperOrder
                }
            }, { new: true });
            res.send({ FileEdited: true });
        }
    } catch (e) {
        res.send({ ErrorMsg: e });
    }
});

// Patch Request For Deleting Previous Year Paper File of Subject
router.patch('/subject/pyqp/file/delete/:ids/:idp', async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idp = req.params.idp
        await Subjects.updateOne({ _id: _ids, "Subject_PreviousYearPapers._id": _idp }, {
            $set: {
                "Subject_PreviousYearPapers.$.PYQ_PaperFile": {
                    File_Name: null,
                    Encoded_File: null,
                    Encoded_FileType: null
                }
            }
        }, { new: true })
        res.send(true);
    } catch (e) {
        res.send(false);
    }
});

// Here We Handle Delete Request for Deleting Subject's Previous Year Papers
router.delete("/subject/previousyearpaper/:ids/:idp", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idp = req.params.idp
        await Subjects.update({ _id: _ids }, { $pull: { "Subject_PreviousYearPapers": { "_id": _idp } } }, { new: true })
        res.send(true);
    } catch (e) {
        res.send(false)
    }
})

// Now We Handle Get Request For Individuals Previous Year Question Paper File of Subject (PYP - Previous Year Paper)
router.get("/subject/pyqp/file/:id/:pypindex", async (req, res) => {
    try {
        const _id = req.params.id
        const pypindex = req.params.pypindex
        const ShowSubject = await Subjects.find({ _id: _id }).select('Subject_PreviousYearPapers');
        const ShowPYP = await ShowSubject[0].Subject_PreviousYearPapers[pypindex]
        const PYP_File = await ShowPYP.PYQ_PaperFile
        res.send({ FileName: PYP_File.File_Name, EncodedFile: `data:${PYP_File.Encoded_FileType};base64,${PYP_File.Encoded_File.toString('base64')}`, FileType: PYP_File.Encoded_FileType });
    } catch (e) {
        res.send(e);
    }
});

// Now We Handle Get Request For Individuals Previous Year Question Paper of Subject (PYP - Previous Year Paper)
router.get("/subject/pyqp/:id/:pypindex", async (req, res) => {
    try {
        const _id = req.params.id
        const pypindex = req.params.pypindex
        const ShowSubject = await Subjects.find({ _id: _id }).select('Subject_PreviousYearPapers');
        const ShowPYP = await ShowSubject[0].Subject_PreviousYearPapers[pypindex]
        res.send({ PYQP_Name: ShowPYP.PYQ_PaperName, PYQP_Order: ShowPYP.PYQ_PaperOrder });
    } catch (e) {
        res.send(e);
    }
});

// Now We Handle Get Request For All Previous Year Question Paper of Subjects (PYP - Previous Year Paper)
router.get("/subject/pyqp/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const ShowSubject = await Subjects.find({ _id: _id }).select('Subject_PreviousYearPapers');
        const ShowPYQP = await ShowSubject[0].Subject_PreviousYearPapers
        res.send(ShowPYQP)
    } catch (e) {
        res.send(e);
    }
})

// Routing For Previous Year Question Paper Answers

// Here We Will Handle the Put Request For Adding Solutions of Previous Year Question in Subjects
router.put("/subjects/pyqp/pyqps/:ids/:idp", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idp = req.params.idp

        const { PYQ_SolutionName, File_Name, Encoded_File, Encoded_FileType } = req.body

        if (Encoded_File === null) {
            res.send({ FileAdded: false, ErrorMsg: 'Please Select the Files' });
        }

        if (Encoded_File !== null && fileType.includes(Encoded_FileType)) {
            const EncodedPYQPSFile = new Buffer.from(Encoded_File, 'base64');
            // Here First We Have to Find the Object by id And Then Find The Array Of Object With that Id And Push it Using Push Method
            await Subjects.update({ _id: _ids, "Subject_PreviousYearPapers._id": _idp }, {
                $push: {
                    "Subject_PreviousYearPapers.$.PYQ_PaperSolutions": {
                        PYQ_SolutionName: PYQ_SolutionName,
                        PYQ_SolutionFile: {
                            File_Name: File_Name,
                            Encoded_File: EncodedPYQPSFile,
                            Encoded_FileType: Encoded_FileType
                        }
                    }
                }
            }, { new: true });
            res.send({ FileAdded: true });
        }
    } catch (e) {
        res.send({ ErrorMsg: e });
    }
})

// Now We Handle Get Request For All Previous Year Question Paper Solutions of Subject (PYP - Previous Year Paper)
router.get("/subject/pyqp/pyqps/:id/:pypindex", async (req, res) => {
    try {
        const _id = req.params.id
        const pypindex = req.params.pypindex
        const ShowSubject = await Subjects.find({ _id: _id }).select('Subject_PreviousYearPapers');
        const ShowPYQPS = await ShowSubject[0].Subject_PreviousYearPapers[pypindex].PYQ_PaperSolutions
        res.send(ShowPYQPS);
    } catch (e) {
        res.send(e);
    }
});

// Here We Handle Delete Request for Deleting PYQP Solutions
router.delete("/subjects/pyqp/pyqps/:ids/:idp/:idps", async (req, res) => {
    try {
        const _ids = req.params.ids
        const _idp = req.params.idp
        const _idps = req.params.idps
        await Subjects.update({ "_id": _ids, "Subject_PreviousYearPapers._id": _idp }, { $pull: { "Subject_PreviousYearPapers.$.PYQ_PaperSolutions": { "_id": _idps } } }, { new: true });
        res.send(true)
    } catch (e) {
        res.send(false);
    }
})

// Now We Handle Get Request For Individuals Previous Year Question Paper Solutions File of Subject (PYP - Previous Year Paper)
router.get("/subject/pyqp/pyqps/file/:ids/:pypindex/:pyqpsindex", async (req, res) => {
    try {
        const _ids = req.params.ids
        const pypindex = req.params.pypindex
        const pyqpsindex = req.params.pyqpsindex
        const ShowSubject = await Subjects.find({ _id: _ids }).select('Subject_PreviousYearPapers');
        const ShowPYQPSFile = await ShowSubject[0].Subject_PreviousYearPapers[pypindex].PYQ_PaperSolutions[pyqpsindex]
        res.send({ FileName: ShowPYQPSFile.PYQ_SolutionFile.File_Name, FileType: ShowPYQPSFile.PYQ_SolutionFile.Encoded_FileType, EncodedFile: `data:${ShowPYQPSFile.PYQ_SolutionFile.Encoded_FileType};base64,${ShowPYQPSFile.PYQ_SolutionFile.Encoded_File.toString('base64')}` });
    } catch (e) {
        res.send(e);
    }
});

module.exports = router