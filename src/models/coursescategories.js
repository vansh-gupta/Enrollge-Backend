const mongoose = require('mongoose');

const CoursesCategoriesSchema = new mongoose.Schema({
    Course_Type: { type: String, require: true },
    Course_Branch: { type: Array, require: true },
    Course_Semester: { type: Array, require: true }
})

// Here, We Are Creating And Collection in MOongoDB of CoursesCategories
const CoursesCategories = new mongoose.model("CoursesCategories", CoursesCategoriesSchema)

module.exports = CoursesCategories