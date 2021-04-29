const express = require('express');
const router = express.Router();
const Reports = require('../models/reports');

// API For Add the Reports in the Database
router.post('/reports', async (req, res) => {
    try {
        const AddReport = new Reports(req.body)
        await AddReport.save()
        res.status(201).json("Report Added")
    } catch (e) {
        res.status(402).json(e);
    }
})

// API to Get All Reports 
router.get("/reports", async (req, res) => {
    try {
        const ShowReports = await Reports.find({});
        res.status(200).send(ShowReports)
    } catch (e) {
        res.status(402).json(e);
    }
})

// API to Delete the Report
router.delete("/report/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await Reports.findByIdAndDelete({ _id: _id })
        res.status(202).json(true);
    } catch (e) {
        res.status(402).json(false);
    }
})

module.exports = router