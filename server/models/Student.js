const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  current_streak: { type: Number, default: 0 },
  last_study_date: String,
  created_at: { type: Date, default: Date.now }
});

studentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('Student', studentSchema);
