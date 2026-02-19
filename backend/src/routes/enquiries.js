const express = require('express');
const Enquiry = require('../models/Enquiry');
const { protect } = require('../middleware/auth');
const router = express.Router();

// GET /api/enquiries — Admin: list all enquiries
router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/enquiries/stats — Admin: enquiry statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const total = await Enquiry.countDocuments();
    const newCount = await Enquiry.countDocuments({ status: 'new' });
    const readCount = await Enquiry.countDocuments({ status: 'read' });
    const repliedCount = await Enquiry.countDocuments({ status: 'replied' });

    res.json({
      success: true,
      data: { total, new: newCount, read: readCount, replied: repliedCount },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/enquiries — Public: create enquiry from contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    const enquiry = await Enquiry.create({ name, email, phone, subject, message });
    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: { id: enquiry._id },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH /api/enquiries/:id/status — Admin: update enquiry status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: new, read, replied',
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/enquiries/:id — Admin: delete enquiry
router.delete('/:id', protect, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
