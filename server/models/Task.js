const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    title: String,
    subject: { type: String, enum: ['physics', 'chemistry', 'biology'] },
    task_type: { type: String, enum: ['daily', 'weekly', 'monthly'] },
    is_completed: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    completed_at: Date,
    estimated_minutes: Number
});

taskSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('Task', taskSchema);
