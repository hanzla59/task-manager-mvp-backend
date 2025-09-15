const express = require('express');
const router = express.Router();
const { createTask, getTasksByProject, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all task routes
router.use(authMiddleware);

// Create a task
router.post('/', createTask);

// Get tasks by project
router.get('/project/:project_id', getTasksByProject);

// Update task status
router.put('/:id/status', updateTaskStatus);

//delete task by id 
router.delete('/:id', deleteTask);

module.exports = router;
