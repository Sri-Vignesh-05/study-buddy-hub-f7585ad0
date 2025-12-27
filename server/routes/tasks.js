const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get tasks (by student ID or all)
router.get('/', async (req, res) => {
    try {
        const { student_id } = req.query;
        const query = student_id ? { student_id } : {};

        const tasks = await Task.find(query).sort({ created_at: -1 });
        res.json({ data: tasks, error: null });
    } catch (err) {
        res.status(500).json({ error: err.message, data: null });
    }
});

// Add task
router.post('/', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.json({ data: task, error: null });
    } catch (err) {
        res.status(500).json({ error: err.message, data: null });
    }
});

// Toggle/Update task
router.patch('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ data: task, error: null });
    } catch (err) {
        res.status(500).json({ error: err.message, data: null });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ error: null });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
