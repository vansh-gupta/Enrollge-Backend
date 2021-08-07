const express = require('express');
const router = express.Router();
const Reports = require('../../models/reports');

// Handle GET Request, For Getting All Reports 
router.get("/admin/reports", async (req, res) => {
    try {
        const ShowReports = await Reports.find({});
        res.status(200).send(ShowReports)
    } catch (e) {
        res.status(402).json({ error: e.message });
    }
})

// Handle Delete Request, For Deleting the Report
router.delete("/admin/report/delete/:id", async (req, res) => {
    try {
        const _id = req.params.id
        await Reports.findByIdAndDelete({ _id: _id })
        res.status(202).json({ ReportDeleted: true });
    } catch (e) {
        res.status(402).json({ error: e.message });
    }
})



// (********************************) Handle API For Mobile App for the App (********************************)



// Handle POST Request, For Adding the Reports in the Database
router.post('/app/reports/add', async (req, res) => {
    try {
        const AddReport = new Reports(req.body)
        await AddReport.save()
        res.status(201).json("Report Added")
    } catch (e) {
        res.status(402).json(e);
    }
})

module.exports = router