const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById, deleteProject } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all project routes
router.use(authMiddleware);

router.post('/', createProject);       // Create project
router.get('/', getProjects);          // Get all projects of user
router.get('/:id', getProjectById);    // Get single project
router.delete('/:id', deleteProject); // Delete project

module.exports = router;
