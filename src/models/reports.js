const mongoose = require('mongoose');

const ReportsSchema = new mongoose.Schema({
    Report_Title: { type: String, require: true },
    Report_SubjectCourse_Name:{ type: String, require: true},
    Report_ChapterName:{ type: String, require: true },
    Report_StudentName: { type: String, require: true },
    Report_StudentEmail: { type: String, require: true },
    Report_Message: { type: String, require: true },
    Report_Status:{ type: String, require:true, default:'Not Resolved' },
    Report_Date: { type: Date, default: Date.now }
})

const Reports = new mongoose.model("Reports", ReportsSchema)

module.exports = Reports