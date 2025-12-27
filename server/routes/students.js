const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().sort({ created_at: -1 });
        res.json({ data: students, error: null });
    } catch (err) {
        res.status(500).json({ error: err.message, data: null });
    }
});

// Get student by ID
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found', data: null });
        res.json({ data: student, error: null });
    } catch (err) {
        res.status(500).json({ error: err.message, data: null });
    }
});

// Register or Login student
router.post('/', async (req, res) => {
    try {
        const { name, age } = req.body;

        let student = await Student.findOne({ name, age });

        if (student) {
            return res.json({ data: student, error: null });
        }

        student = new Student({ name, age });
        await student.save();
        res.json({ data: student, error: null });
    } catch (err) {
        res.status(500).json({ error: err.message, data: null });
    }
});

// Update streak
router.patch('/:id', async (req, res) => {
    try {
        const { current_streak, last_study_date } = req.body;
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { current_streak, last_study_date },
            { new: true }
        );
        res.json({ data: student, error: null });
    } catch (err) {
        res.status(500).json({ error: err.message, data: null });
    }
});

module.exports = router;
