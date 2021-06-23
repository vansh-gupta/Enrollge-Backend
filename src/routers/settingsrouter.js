const express = require('express');
const router = new express.Router();
const Settings = require('../models/settings');

// API To Get Settings
router.get('/settings', async (req, res) => {
    try {
        const SettingsData = await Settings.find({})
        res.status(201).send(SettingsData);
    } catch (error) {
        res.status(402).json(error);
    }
})

// API to Create Settings
router.post('/settings', async (req, res) => {
    try {
        const AddTermsAndConditions = new Settings(req.body)
        await AddTermsAndConditions.save();
        res.status(201).send(true)
    } catch (error) {
        res.status(400).json(error);
    }
})

// API To Update Settings
router.patch('/settings/:id', async (req, res) => {
    try {
        const _id = req.params.id
        await Settings.findByIdAndUpdate({ _id: _id }, req.body, { new: true });
        res.status(200).send(true);
    } catch (error) {
        res.status(402).json(false);
    }
})

module.exports = router;