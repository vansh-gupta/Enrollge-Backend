const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
    University_Name: {
        type: String,
        require: true
    }
})

// Here, We Are Creating And Collection in MOongoDB of University
const University = new mongoose.model("UniversityName", UniversitySchema)

module.exports = University