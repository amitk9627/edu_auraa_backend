const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  instituteId: { type: String, required: true },
  facultyName: { type: String, required: true },
  subject: { type: String, required: true },
  experience: { type: Number, required: true },
  aboutFaculty: { type: String },
  profile: { type: String }, // Assume this is a URL or base64 string
  linkedCourses: [{ type: Array }] // Array of course IDs or names
}, {timestamps: true});

module.exports = mongoose.model('faculty', facultySchema);
