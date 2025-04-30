const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  instituteId: { type: String, required: true },
  courseName: { type: String, required: true },
  examType: { type: String, required: true },
  mode: { type: String, required: true },
  duration: { type: String, required: true }
}, {timestamps: true});

module.exports = mongoose.model('courses', courseSchema);
