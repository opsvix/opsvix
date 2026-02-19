const express = require('express');
const Testimony = require('../models/Testimony');
const { protect } = require('../middleware/auth');
const { uploadAvatar, cloudinary } = require('../config/cloudinary');
const router = express.Router();

// GET /api/testimonies — Public: list all testimonies
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    const filter = {};
    if (featured === 'true') filter.featured = true;

    const testimonies = await Testimony.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: testimonies.length, data: testimonies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/testimonies/:id — Public
router.get('/:id', async (req, res) => {
  try {
    const testimony = await Testimony.findById(req.params.id);
    if (!testimony) {
      return res.status(404).json({ success: false, message: 'Testimony not found' });
    }
    res.json({ success: true, data: testimony });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/testimonies — Admin: create testimony
router.post('/', protect, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.avatar = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    const testimony = await Testimony.create(data);
    res.status(201).json({ success: true, data: testimony });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/testimonies/:id — Admin: update testimony
router.put('/:id', protect, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    const testimony = await Testimony.findById(req.params.id);
    if (!testimony) {
      return res.status(404).json({ success: false, message: 'Testimony not found' });
    }

    const data = { ...req.body };

    if (req.file) {
      // Delete old avatar
      if (testimony.avatar?.publicId) {
        await cloudinary.uploader.destroy(testimony.avatar.publicId);
      }
      data.avatar = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    const updated = await Testimony.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/testimonies/:id — Admin: delete testimony
router.delete('/:id', protect, async (req, res) => {
  try {
    const testimony = await Testimony.findById(req.params.id);
    if (!testimony) {
      return res.status(404).json({ success: false, message: 'Testimony not found' });
    }

    // Delete avatar from Cloudinary
    if (testimony.avatar?.publicId) {
      await cloudinary.uploader.destroy(testimony.avatar.publicId);
    }

    await Testimony.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimony deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
