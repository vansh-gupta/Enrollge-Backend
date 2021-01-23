const mongoose = require("mongoose");

const StudentsSchema = mongoose.Schema({
    Full_Name: {
        type: String,
        require: true,
        trim: true
    },
    Branch: {
        type: String,
        require: true,
        trim: true
    },
    Specialization: {
        type: String,
        require: true,
        trim: true
    },
    Semester: {
        type: Number,
        require: true,
    },
    Gmail_ID: {
        type: String,
        require: true
    },
    Mobile_No: {
        type: String,
        require: true,
        unique: true
    },
    College_Name: {
        type: String,
        require: true,
        trim: true
    }
});

// Here, We Are Creating An Collection in MongoDB Database
const Students = new mongoose.model("Students", StudentsSchema);

module.exports = Students;