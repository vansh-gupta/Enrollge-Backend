const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
    University_Name: {
        type: String,
        require: true
    },
    University_Published: { type: Boolean, default: true },
    University_Courses: [{
        Course_Name: { type: String, require: true },
        Course_Published: { type: Boolean, default: true },
        Course_Branches: [{
            Branch_Name: { type: String, require: true },
            Branch_Published: { type: Boolean, default: true }
        }],
        Course_Years: [{
            Course_Year: { type: Number, require: true },
            Year_Published: { type: Boolean, default: true }
        }]
    }],
    University_News: [{
        News_Title: { type: String, require: true },
        News_Url: { type: String, require: true },
        News_Published: { type: Boolean, require: true },
        News_Date: { type: String, default: Date, require: true }
    }]
})

// Here, We Are Creating And Collection in MOongoDB of University
const University = new mongoose.model("University", UniversitySchema)

module.exports = University