const mongoose = require('mongoose');

const CoursesTypesSchema = mongoose.Schema({
    Course_Type: { type: String, require: true },
    Course_TypeDescription: { type: String, require: true },
    Course_TypeImgUrl: { type: String, require: true },
    Course_TypePublished: { type: Boolean, default: true }
})

const CoursesTypes = new mongoose.model("CoursesTypes", CoursesTypesSchema)

module.exports = CoursesTypes;