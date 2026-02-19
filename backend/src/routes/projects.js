const express = require('express');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const { uploadProjectImages, cloudinary } = require('../config/cloudinary');
const router = express.Router();

// GET /api/projects — Public: list all published projects
router.get('/', async (req, res) => {
  try {
    const { category, featured, status } = req.query;
    const filter = {};

    // Public route shows only published by default
    if (status) {
      filter.status = status;
    } else {
      filter.status = 'published';
    }

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/projects/all — Admin: list ALL projects including drafts
router.get('/all', protect, async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/projects/:id — Public: get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/projects — Admin: create project
router.post(
  '/',
  protect,
  uploadProjectImages.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const projectData = { ...req.body };

      // Parse technologies from comma-separated string
      if (typeof projectData.technologies === 'string') {
        projectData.technologies = projectData.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }

      // Handle thumbnail
      if (req.files?.thumbnail?.[0]) {
        projectData.thumbnail = {
          url: req.files.thumbnail[0].path,
          publicId: req.files.thumbnail[0].filename,
        };
      }

      // Handle images
      if (req.files?.images) {
        projectData.images = req.files.images.map((file) => ({
          url: file.path,
          publicId: file.filename,
        }));
      }

      const project = await Project.create(projectData);
      res.status(201).json({ success: true, data: project });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

// PUT /api/projects/:id — Admin: update project
router.put(
  '/:id',
  protect,
  uploadProjectImages.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      const updateData = { ...req.body };

      // Parse technologies
      if (typeof updateData.technologies === 'string') {
        updateData.technologies = updateData.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }

      // Handle new thumbnail
      if (req.files?.thumbnail?.[0]) {
        // Delete old thumbnail from Cloudinary
        if (project.thumbnail?.publicId) {
          await cloudinary.uploader.destroy(project.thumbnail.publicId);
        }
        updateData.thumbnail = {
          url: req.files.thumbnail[0].path,
          publicId: req.files.thumbnail[0].filename,
        };
      }

      // Handle new images (append)
      if (req.files?.images) {
        const newImages = req.files.images.map((file) => ({
          url: file.path,
          publicId: file.filename,
        }));
        updateData.images = [...(project.images || []), ...newImages];
      }

      const updated = await Project.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

// DELETE /api/projects/:id — Admin: delete project
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Delete images from Cloudinary
    if (project.thumbnail?.publicId) {
      await cloudinary.uploader.destroy(project.thumbnail.publicId);
    }
    for (const img of project.images || []) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/projects/:id/images/:publicId — Admin: remove single image
router.delete('/:id/images/:publicId', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const publicId = req.params.publicId;
    await cloudinary.uploader.destroy(publicId);

    project.images = project.images.filter((img) => img.publicId !== publicId);
    await project.save();

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
