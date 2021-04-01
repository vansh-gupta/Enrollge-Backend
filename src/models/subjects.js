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
    Subject_Course: {
        type: String,
        require: true
    },
    Subject_Branch: {
        type: String,
        require: true
    },
    Subject_Semester: {
        type: String,
        require: true
    },
    Subject_imgurl: {
        type: String,
        require: true
    },
    Chapters: [{
        Chapter_Name: { type: String, require: true },
        Chapter_Order: { type: String, require: true },
        Subject_Name: { type: String, require: true },
        Subject_Order: { type: String, require: true },
        Topics: [{
            Topic_Name: { type: String, require: true },
            Topic_Order: { type: String, require: true, unique: true },
            Topic_Description: { type: String, require: true },
            Chapter_Order: { type: String, require: true },
            Topic_Url: { type: String, require: true },
            Topic_ImgUrl: { type: String, require: true }
        }]
    }]
}, { autoIndex: false })

const Subjects = new mongoose.model("Subjects", SubjectsSchema);

module.exports = Subjects;