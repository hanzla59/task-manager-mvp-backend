const Task = require('../models/taskModel');

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, project_id, assigned_to, due_date } = req.body;

    const task = await Task.create(title, description, project_id, assigned_to, due_date);
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get tasks of a project
const getTasksByProject = async (req, res) => {
  try {
    const project_id = req.params.project_id;
    const tasks = await Task.findByProject(project_id);
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;
    const task = await Task.create.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if(task.assigned_to !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedTask = await Task.updateStatus(id, status);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const task = await Task.findById(id);
    if(!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.assigned_to !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const deleted = await Task.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task successfully deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTask, getTasksByProject, updateTaskStatus, deleteTask };
