const Project = require('../models/projectModel');

// Create a new project
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const owner_id = req.user.id; // from auth middleware

    const project = await Project.create(name, description, owner_id);
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get projects of logged-in user
const getProjects = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const projects = await Project.findByOwner(owner_id);
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Delete a project by ID
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const project = await Project.findById(id);
    if(!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    console.log(`Project Owner ID: ${project.owner_id}, Requesting User ID: ${userId}`);
    if (project.owner_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const deleted = await Project.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project successfully deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createProject, getProjects, getProjectById, deleteProject };
