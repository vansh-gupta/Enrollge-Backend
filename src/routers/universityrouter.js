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
        res.status(402).send(false)
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
})

module.exports = router