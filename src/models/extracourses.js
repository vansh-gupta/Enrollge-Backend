const mongoose = require("mongoose");

const ExtraCoursesSchema = new mongoose.Schema({
    ExtraCourses_Name: { type: String, require: true },
    ExtraCourses_Order: { type: Number, require: true, unique: true },
    ExtraCourses_Topics: [{
        ExtraCourses_TopicName: { type: String, require: true },
        ExtraCourses_TopicOrder: { type: Number, require: true, unique: true },
        ExtraCourses_TopicDescription: { type: String, require: true },
        ExtraCourses_TopicUrl: { type: String, require: true },
        ExtraCourses_TopicImgUrl: { type: String, require: true }
    }]
})

// Here, We Are Creating And Collection in MOongoDB of Name ExtraCourses
const ExtraCourses = new mongoose.model("ExtraCourses", ExtraCoursesSchema);

module.exports = ExtraCourses;