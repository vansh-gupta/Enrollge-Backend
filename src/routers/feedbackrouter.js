const express = require('express')
const router = new express.Router();
const Feedback = require('../models/feedback');

// API to get FeedBack Message
router.get('/feedback', async (req, res) => {
    try {
        const ShowFeedback = await Feedback.find({})
        res.status(200).send(ShowFeedback);
    } catch (error) {
        res.status(400).send(error);
    }
})

// API to Create Feedback Message
router.post('/feedback', async (req, res) => {
    try {
        const AddFeedback = new Feedback(req.body)
        await AddFeedback.save();
        res.status(200).json(true)
    } catch (error) {
        res.status(400).json(false);
    }
})

// API to delete Feedback Message
router.delete('/feedback/:id', async (req, res) => {
    try {
        const _id = req.params.id
        await Feedback.findByIdAndDelete({ _id: _id })
        res.status(202).json(true)
    } catch (error) {
        res.status(400).json(false);
    }
})

module.exports = router;