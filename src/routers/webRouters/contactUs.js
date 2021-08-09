const express = require('express');
const router = new express.Router();
const ContactUs = require("../../models/contactus");

// Handling POST Request, to Add the Contact Us Info in the Database
router.post('/web/contactus', async (req, res) => {
    try {
        const AddContactUsData = new ContactUs(req.body);
        await AddContactUsData.save();
        res.status(201).send(true);
    } catch (e) {
        res.status(402).send(false);
    }
});



// (********************************) Handle API For Admin Panel for the Website of Enrollge (********************************)



// Handling GET Request, to get ContactUs Info in Admin Panel
router.get("/admin/contactus", async (req, res) => {
    try {
        const ShowContactUsData = await ContactUs.find({});
        res.status(200).send(ShowContactUsData);
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
})

//  Handling DELETE Request, to delete contact us Info from database
router.delete('/admin/contactus/delete/:id', async (req, res) => {
    try {
        const _id = req.params.id
        await ContactUs.findByIdAndDelete({ _id: _id });
        res.status(202).json({ ContactUsDeleted: true });
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
})

module.exports = router