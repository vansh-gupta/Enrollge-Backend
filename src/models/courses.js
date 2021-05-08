const mongoose = require("mongoose");

const CoursesSchema = new mongoose.Schema({
    Courses_Name: { type: String, require: true },
    Courses_Order: { type: Number, require: true },
    Courses_Type: { type: String, required: true },
    Courses_Description: { type: String, required: true },
    Courses_ImgUrl: { type: String, required: true },
    Courses_Topics: [{
        Courses_TopicName: { type: String, require: true },
        Courses_TopicOrder: { type: Number, require: true },
        Courses_TopicDescription: { type: String, require: true },
        Courses_TopicUrl: { type: String, require: true },
        Courses_TopicSource: { type: String, require: true },
        Courses_TopicImgUrl: { type: String, default: 'https://firebasestorage.googleapis.com/v0/b/vidmax-9f2ce.appspot.com/o/Enrollge%20Images%2Ffinallogo.png?alt=media&token=0d308e5c-314f-41a4-88b6-8d0d96e64d8b', require: true }
    }]
})

// Here, We Are Creating And Collection in MOongoDB of Name ExtraCourses
const Courses = new mongoose.model("Courses", CoursesSchema);

module.exports = Courses;
