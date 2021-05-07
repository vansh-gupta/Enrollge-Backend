const express = require('express');
const router = new express.Router();
const ContactUs = require("../models/contactus");


// API to Add the Contact Us
router.post('/contactus', async (req, res) => {
    try {
        const AddContactUsData = new ContactUs(req.body)
        await AddContactUsData.save()
        res.status(201).send(true);
    } catch (e) {
        res.status(402).send(false)
    }
})

// API to Get All Universities
router.get("/contactus", async (req, res) => {
    try {
        const ShowContactUsData = await ContactUs.find({});
        res.status(200).send(ShowContactUsData);
    } catch (err) {
        res.status(402).json(e);
    }
})

//  API To Delete Contact Us
router.delete('/contactus/:id', async (req, res) => {
    try {
        const _id = req.params.id
        await ContactUs.findByIdAndDelete({ _id: _id });
        res.status(202).json(true);
    } catch (error) {
        res.status(402).json(false);
    }
})

module.exports = router