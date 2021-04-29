const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    Feedback_StudentName: {
        type: String,
        require: true
    },
    Feedback_StudentEmail: {
        type: String,
        require: true
    },
    Feedback_Message: {
        type: String,
        require: true
    },
    Feedback_Date: {
        type: Date,
        default: Date.now
    }
})

const Feedback = new mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;