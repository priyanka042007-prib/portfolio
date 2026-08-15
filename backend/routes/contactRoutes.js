const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

// POST a new contact message
router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please fill out all fields (name, email, and message)."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        const newContact = new Contact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim()
        });

        const savedContact = await newContact.save();

        res.status(201).json({
            success: true,
            message: "Thank you! Your message has been sent successfully.",
            data: savedContact
        });

    } catch (error) {
        console.error("Error saving contact message:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send message. Please try again later.",
            error: error.message
        });
    }
});

module.exports = router;
