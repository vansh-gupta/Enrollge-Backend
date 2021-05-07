const mongoose = require('mongoose');

const ContactUsSchema = new mongoose.Schema({
    Full_Name: { type: String, require: true },
    Gmail_Id: { type: String, require: true },
    Mobile_No: { type: Number, require: true },
    Subject: { type: String, require: true },
    Message: { type: String, require: true },
    ContactUs_Date: { type: Date, default: Date.now }
})

// Here, We Are Creating And Collection in MOongoDB of Contact Us
const ContactUs = new mongoose.model("ContactUs", ContactUsSchema)

module.exports = ContactUs