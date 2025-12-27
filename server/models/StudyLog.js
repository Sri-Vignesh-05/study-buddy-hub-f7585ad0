const mongoose = require('mongoose');

const studyLogSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    study_date: String,
    hours: Number,
    created_at: { type: Date, default: Date.now }
});

studyLogSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('StudyLog', studyLogSchema);
