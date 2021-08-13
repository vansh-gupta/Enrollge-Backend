const express = require('express');
const router = new express.Router();
const University = require("../../models/university");

// Handle GET Request, For Getting Uiversity News
router.get("/admin/university/news/:idu", async (req, res) => {
    try {
        const _id = req.params.idu
        const ShowUniversityNews = await University.find({ _id: _id }).select('University_News');
        res.status(200).send(ShowUniversityNews);
    } catch (e) {
        res.status(402).json({ error: e.message });
    }
});

// Handle PUT Request, For Adding News in the University
router.put('/admin/university/news/add/:idu', async (req, res) => {
    try {
        const _id = req.params.idu
        await University.updateOne({ _id: _id }, { $push: { 'University_News': req.body } }, { new: true });
        res.status(200).send({ UniveristyNewsAdded: true });
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
});

// Handle Delete Request, For Deleting University News
router.delete("/admin/university/news/delete/:idu/:idn", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idn = req.params.idn
        await University.updateOne({ _id: _idu }, { $pull: { "University_News": { "_id": _idn } } }, { new: true })
        res.send({ UniversityNewsDeleted: true });
    } catch (e) {
        res.send({ error: e.message })
    }
})

// Handle Patch Request, For Update News of University
router.patch("/admin/university/news/update/:idu/:idn", async (req, res) => {
    try {
        const _idu = req.params.idu
        const _idn = req.params.idn
        await University.updateOne({ _id: _idu, "University_News._id": _idn }, { $set: req.body }, { new: true })
        res.send({ UniveristyNewsUpdated: true });
    } catch (e) {
        res.send({ error: e.message });
    }
})






// (********************************) Handle API for University News for Mobile APP (********************************)






// Handle GET Request, For Getting Uiversity News
router.get("/app/university/news/:universityname", async (req, res) => {
    try {
        const universityname = req.params.universityname
        const ShowUniversityNews = await University.find({ University_Name: new RegExp(universityname, 'i') }).select('University_News');
        const UniversityNews = await ShowUniversityNews[0].University_News.reverse();
        res.status(200).json(UniversityNews);
    } catch (e) {
        res.status(402).json({ error: e.message });
    }
});


module.exports = router