const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    TermsAndConditions: { type: String, require: true, default: 'Terms And Conditions Should be Here' }
})

// Here, We Are Creating And Collection in MOongoDB of Settings
const Settings = new mongoose.model("Settings", SettingsSchema)

module.exports = Settings;