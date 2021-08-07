const express = require('express');
const router = new express.Router();
const Settings = require('../../models/settings');

// Handle GET Request, For Getting Settings Data
router.get('/admin/settings', async (req, res) => {
    try {
        const SettingsData = await Settings.find({})
        res.status(201).send(SettingsData);
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
})

// Handle POST Request, For Adding Setting (First TIme Only !!)
router.post('/admin/settings/add', async (req, res) => {
    try {
        const AddTermsAndConditions = new Settings(req.body)
        await AddTermsAndConditions.save();
        res.status(201).send({ SettingsAdded: true })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

// Handle PATCH Request, For Update Settings
router.patch('/admin/settings/update/:id', async (req, res) => {
    try {
        const _id = req.params.id
        await Settings.findByIdAndUpdate({ _id: _id }, req.body, { new: true });
        res.status(200).send({ updateSettings: 'OK' });
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
})

module.exports = router;