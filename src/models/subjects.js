const mongoose = require("mongoose");

const SubjectsSchema = new mongoose.Schema({
    Subject_Name: {
        type: String,
        require: true
    },
    Subject_Order: {
        type: String,
        require: true
    },
    Subject_University: {
        type: String,
        require: true
    },
    Subject_Course: {
        type: String,
        require: true
    },
    Subject_Branch: {
        type: Array,
        require: true
    },
    Subject_Year: {
        type: String,
        require: true
    },
    Subject_Published: {
        type: Boolean,
        default: true
    },
    Chapters: [{
        Chapter_Name: { type: String, require: true },
        Chapter_Order: { type: String, require: true },
        Subject_Name: { type: String, require: true },
        Subject_Order: { type: String, require: true },
        Chapter_Published: { type: Boolean, default: true },
        Topics: [{
            Topic_Name: { type: String, require: true },
            Topic_Order: { type: String, require: true },
            Topic_Description: { type: String, require: true },
            Chapter_Order: { type: String, require: true },
            Topic_ImgUrl: { type: String, default: 'https://firebasestorage.googleapis.com/v0/b/vidmax-9f2ce.appspot.com/o/Enrollge%20Images%2Ffinallogo.png?alt=media&token=0d308e5c-314f-41a4-88b6-8d0d96e64d8b', require: true },
            Topic_Source: { type: String, require: true },
            Topic_Url: { type: String, require: true }
        }]
    }]
}, { autoIndex: false })

const Subjects = new mongoose.model("Subjects", SubjectsSchema);

module.exports = Subjects;