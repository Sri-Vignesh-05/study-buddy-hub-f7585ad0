const express = require('express');
const router = express.Router();
const StudyLog = require('../models/StudyLog');

// Get logs
router.get('/', async (req, res) => {
    try {
        const { student_id } = req.query;
        if (!student_id) return res.status(400).json({ error: 'student_id required', data: null });

        const logs = await StudyLog.find({ student_id })
            .sort({ study_date: -1 })
            .limit(30);
        res.json({ data: logs, error: null });
    } catch (err) {
        res.status(500).json({ error: err.message, data: null });
    }
});

// Add log
router.post('/', async (req, res) => {
    try {
        const log = new StudyLog(req.body);
        await log.save();
        res.json({ data: log, error: null });
    } catch (err) {
        res.status(500).json({ error: err.message, data: null });
    }
});

// Update log
router.patch('/:id', async (req, res) => {
    try {
        const log = await StudyLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ data: log, error: null });
    } catch (err) {
        res.status(500).json({ error: err.message, data: null });
    }
});

module.exports = router;
