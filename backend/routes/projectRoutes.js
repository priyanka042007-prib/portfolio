const express = require("express");
const Project = require("../models/project");

const router = express.Router();

// GET all projects
router.get("/", async (req, res) => {
    try {
        const projects = await Project.find();

        console.log("Projects found:", projects);

        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);

        res.status(500).json({
            message: "Error fetching projects",
            error: error.message
        });
    }
});
// GET a single project by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the provided ID is a valid MongoDB ObjectId
        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json(project);

    } catch (error) {
        console.error("Error fetching project:", error);

        res.status(500).json({
            message: "Error fetching project",
            error: error.message
        });
    }
});
// POST a new project
router.post("/", async (req, res) => {
    try {
        const { name, technology, description, features } = req.body;

        const project = new Project({
            name,
            technology,
            description,
            features: Array.isArray(features) ? features : []
        });

        const savedProject = await project.save();

        res.status(201).json(savedProject);
    } catch (error) {
        console.error("Error adding project:", error);

        res.status(500).json({
            message: "Error adding project",
            error: error.message
        });
    }
});

module.exports = router;