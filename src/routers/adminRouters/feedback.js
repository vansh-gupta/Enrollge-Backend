const express = require('express')
const router = new express.Router();
const Feedback = require('../../models/feedback');

// Handle GET Request, For Getting FeedBack Messages
router.get('/admin/feedback', async (req, res) => {
    try {
        const ShowFeedback = await Feedback.find({})
        res.status(200).send(ShowFeedback);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
})

// Handle Delete Request, For deleting Feedback Message
router.delete('/admin/feedback/delete/:id', async (req, res) => {
    try {
        const _id = req.params.id
        await Feedback.findByIdAndDelete({ _id: _id })
        res.status(202).json({ FeedbackDeleted: true })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})




// (********************************) Handle API For Mobile App For Feedback (********************************)




// Handle POST Request, For Adding Feedbacks
router.post('/app/feedback/add', async (req, res) => {
    try {
        const AddFeedback = new Feedback(req.body)
        await AddFeedback.save();
        res.status(200).json(true)
    } catch (error) {
        res.status(400).json(false);
    }
})

module.exports = router;